import { Seq, fromJS as immutableJS } from 'immutable';

import { isPositiveNumber, parseIntBase10 } from './general';
import { Quiz, Question, QuestionChoice } from '../database';

const { statuses } = Quiz.mappings;
const { questionTypes } = Question.mappings;

export class ValidationError extends Error {}

export function validateAnswer(questionsRaw) {
  const questions = immutableJS(questionsRaw);

  return (userAnswer) => new Promise((resolve, reject) => {
    if (typeof userAnswer !== 'object') {
      return reject(new ValidationError('User answer must be an object'));
    }
    const { answer = null } = userAnswer;
    const questionId = parseIntBase10(userAnswer.questionId);
    if (!isPositiveNumber(questionId) || answer === null) {
      return reject(new ValidationError('User answer format: {id: Number, answer: Number || String || Array}'));
    }
    const question = questions.find(({ questionId: id }) => id === questionId);
    if (!question) {
      return reject(new ValidationError(`Question ID ${questionId} does not exist`));
    }

    const { type } = question;
    let expectedType = '';
    if (type === 'checkbox') {
      if (!Array.isArray(answer)) {
        expectedType = 'Array of Numbers';
      } else {
        const answers = answer.map(parseIntBase10);
        if (!answers.every(isPositiveNumber)) {
          expectedType = 'Array of Numbers';
        } else {
          return resolve({ questionId, answer: answers });
        }
      }
    } else if (type === 'fillblank') {
      if (Array.isArray(answer) && answer.some((value) => typeof value !== 'string')) {
        expectedType = 'Array of Strings';
      }
    } else if (type === 'textarea') {
      if (typeof answer !== 'string') {
        expectedType = 'String';
      }
    } else if (type === 'radio') {
      const parsed = parseIntBase10(answer);
      if (!isPositiveNumber(parsed)) {
        expectedType = 'Number';
      } else {
        return resolve({ questionId, answer: parsed });
      }
    }

    if (expectedType) {
      return reject(new ValidationError(
        `Malformed user answer '${answer}': expected ${expectedType} for type ${type}, question ID ${questionId}`));
    }
    return resolve({ questionId, answer });
  });
}

export function verifyAnswer(questionsRaw) {
  const questions = immutableJS(questionsRaw);

  return ({ answer, questionId }) => new Promise((resolve) => {
    const { type, choices } = questions.find(({ questionId: id }) => id === questionId);
    const resolvable = { questionId, answer, isCorrect: null };

    if (type === 'radio') {
      const choice = choices.find(({ questionChoiceId: id }) => id === answer);
      return resolve({ ...resolvable, isCorrect: !!(choice && choice.get('isAnswer')) });
    } else if (type === 'checkbox') {
      const choiceSeq = new Seq(choices.filter(({ isAnswer }) => isAnswer));
      const answerSeq = new Seq.Set(answer);
      return resolve({
        ...resolvable,
        isCorrect: choiceSeq.count() === answerSeq.count() &&
          choiceSeq.map(({ questionChoiceId }) => questionChoiceId)
          .toSetSeq()
          .equals(answerSeq),
      });
    } else if (type === 'fillblank') {
      const trimmedAnswers = answer.map((ans) => ans.trim());
      return resolve({
        ...resolvable,
        answer: trimmedAnswers,
        isCorrect: new Seq(choices)
        .sort()
        .map(({ value }) => value)
        .equals(new Seq(trimmedAnswers)),
      });
    }
    return resolve(resolvable);
  });
}

export function validateQuizParams(quiz) {
  return new Promise((resolve, reject) => {
    const { status, title, timeLimit, questions } = quiz;
    if (!statuses.has(status)) {
      return reject(new ValidationError(`status must be one of [${statuses.keySeq().toArray()}].`));
    }
    if (!title || typeof title !== 'string') {
      return reject(new ValidationError('title must be a String'));
    }
    const parsedTimeLimit = parseIntBase10(timeLimit);
    if (timeLimit !== null && !isPositiveNumber(parsedTimeLimit)) {
      return reject(new ValidationError('timeLimit must be a positive Number'));
    }
    if (!Array.isArray(questions)) {
      return reject(new ValidationError('questions must be an Array'));
    }
    return resolve({
      title,
      status,
      timeLimit: timeLimit === null ? null : parsedTimeLimit,
      questions,
    });
  });
}

export function validateQuestion({ id, type, question, choices }) {
  return new Promise((resolve, reject) => {
    const parsedId = parseIntBase10(id);
    if (id !== undefined && !isPositiveNumber(parsedId)) {
      return reject(new ValidationError('id (if exists) must be a positive Number'));
    }
    if (!questionTypes.has(type)) {
      return reject(new ValidationError(`type must be one of [${questionTypes}]`)); // FIXME: String representation of immutableJS Map
    }
    if (!question || typeof question !== 'string') {
      return reject(new ValidationError('question must be a non-empty String'));
    }
    if (type === 'textarea') {
      return resolve({ type, question });
    }
    if (!Array.isArray(choices) || (type === 'fillblank' && choices.length === 0) || choices.length < 2) {
      return reject(new ValidationError('choices must be an Array of { value: String, isAnswer: Boolean }.' +
        ' fillblank at least length 1, radio and checkbox at least length 2'));
    }
    const trimmedChoices = choices.map(({ id: choiceId, value, isAnswer }) =>
      ({ id: choiceId, value: value.trim(), isAnswer: type === 'fillblank' ? true : !!isAnswer }));
    if (choices.some(({ value }) => typeof value !== 'string' || value.length === 0)) {
      return reject(new ValidationError('choice values must be non-empty Strings'));
    }
    if (choices.filter(({ isAnswer }) => isAnswer).length === 0) {
      return reject(new ValidationError('Each question (except textarea) must have at least one answer'));
    }
    return resolve({ id: parsedId, type, question, choices: trimmedChoices });
  });
}

export function convertQuizMappings(quiz) {
  return {
    ...quiz,
    status: statuses.keyOf(quiz.status),
    questions: quiz.questions.map((question) => ({
      ...question,
      type: questionTypes.keyOf(question.type),
    })),
  };
}

export function getQuestionChoices({ questionId, type }, includeAnswers = false) {
  if (type === questionTypes.get('textarea')) {
    return Promise.resolve([]);
  }

  const query = QuestionChoice.query('QC')
  .select(
    'QC.question_choice_id AS questionChoiceId'
  ).where('question_id', questionId);

  if (includeAnswers) {
    return query.select(
      'QC.is_answer AS isAnswer',
      'QC.value'
    );
  }

  return type === questionTypes.get('fillblank') ? query : query.select('QC.value');
}

export function getQuizQuestions(quizId, withChoices = true, includeAnswers = false) {
  const query = Question.query('Q')
  .select(
    'Q.question_id AS questionId',
    'Q.question',
    'Q.type',
    'Q.order_by AS orderBy'
  ).where('quiz_id', quizId);

  if (withChoices) {
    return query
    .then((questions) => Promise.all(questions.map((question) =>
      getQuestionChoices(question, includeAnswers)
      .then((choices) => Promise.resolve({ ...question, choices }))))
    );
  }
  return query;
}
