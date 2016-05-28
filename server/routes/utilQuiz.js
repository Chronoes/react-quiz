import { isPositiveNumber, parseIntBase10 } from '../util';
import { Seq, fromJS as immutableJS } from 'immutable';
import { Quiz } from '../database';

const { statuses } = Quiz.mappings;

const questionTypes = ['radio', 'checkbox', 'fillblank', 'textarea'];

export class ValidationError extends Error {}

export function validateAnswer(questionsRaw) {
  const questions = immutableJS(questionsRaw);
  return (userAnswer) => new Promise((resolve, reject) => {
    if (typeof userAnswer !== 'object') {
      return reject(new ValidationError('User answer must be an object'));
    }
    const { answer = null } = userAnswer;
    const questionId = parseIntBase10(userAnswer.id);
    if (!isPositiveNumber(questionId) || answer === null) {
      return reject(new ValidationError('User answer format: {id: Number, answer: Number || String || Array}'));
    }
    const question = questions.find(({ id }) => id === questionId);
    if (!question) {
      return reject(new ValidationError(`Question ID ${questionId} does not exist`));
    }
    const { type } = question;
    const error = { expected: '' };
    if (type === 'checkbox') {
      if (!Array.isArray(answer)) {
        error.expected = 'Array of Numbers';
      } else {
        const answers = answer.map(parseIntBase10);
        if (!answers.every(isPositiveNumber)) {
          error.expected = 'Array of Numbers';
        } else {
          return resolve({ questionId, answer: answers });
        }
      }
    } else if (type === 'fillblank') {
      if (Array.isArray(answer) && answer.some((value) => typeof value !== 'string')) {
        error.expected = 'Array of Strings';
      }
    } else if (type === 'textarea') {
      if (typeof answer !== 'string') {
        error.expected = 'String';
      }
    } else if (type === 'radio') {
      const parsed = parseIntBase10(answer);
      if (!isPositiveNumber(parsed)) {
        error.expected = 'Number';
      } else {
        return resolve({ questionId, answer: parsed });
      }
    }

    if (error.expected) {
      return reject(new ValidationError(
        `Malformed user answer '${answer}': expected ${error.expected} for type ${type}, question ID ${questionId}`));
    }
    return resolve({ questionId, answer });
  });
}

export function verifyAnswer(questionsRaw) {
  const questions = immutableJS(questionsRaw);
  return ({ answer, questionId }) => new Promise((resolve) => {
    const { type, questionChoices } = questions.find(({ id }) => id === questionId);
    const resolvable = { questionId, answer, isCorrect: null };
    if (type === 'radio') {
      const question = questionChoices.find(({ id }) => id === answer);
      return resolve({ ...resolvable, isCorrect: !!(question && question.get('isAnswer')) });
    } else if (type === 'checkbox') {
      const choiceSeq = new Seq(questionChoices.filter(({ isAnswer }) => isAnswer));
      const answerSeq = new Seq.Set(answer);
      return resolve({ ...resolvable,
        isCorrect: choiceSeq.count() === answerSeq.count() &&
          choiceSeq.map(({ id }) => id)
          .toSetSeq()
          .equals(answerSeq),
      });
    } else if (type === 'fillblank') {
      const trimmedAnswers = answer.map((ans) => ans.trim());
      return resolve({ ...resolvable,
        answer: trimmedAnswers,
        isCorrect: new Seq(questionChoices)
        .sort()
        .map(({ value }) => value)
        .equals(new Seq(trimmedAnswers)),
      });
    }
    return resolve(resolvable);
  });
}

export function validateQuiz(quiz) {
  return new Promise((resolve, reject) => {
    const { status, title, timeLimit, questions } = quiz;
    if (!statuses.has(status)) {
      return reject(new ValidationError(`status must be one of [${statuses.keySeq().toArray()}].`));
    }
    if (!title || typeof title !== 'string') {
      return reject(new ValidationError('title must be a String'));
    }
    const parsedTimeLimit = parseIntBase10(timeLimit);
    if (timeLimit !== undefined && !isPositiveNumber(parsedTimeLimit)) {
      return reject(new ValidationError('timeLimit must be a positive Number'));
    }
    if (!Array.isArray(questions)) {
      return reject(new ValidationError('questions must be an Array'));
    }
    return resolve(immutableJS({ status, title, timeLimit, questions })
    .update('status', (statusStr) => statuses.get(statusStr))
    .set('timeLimit', timeLimit === undefined ? null : parsedTimeLimit)
    .toJS());
  });
}

export function validateQuestion({ type, question, choices }) {
  return new Promise((resolve, reject) => {
    if (!questionTypes.includes(type)) {
      return reject(new ValidationError(`type must be one of [${questionTypes}]`));
    }
    if (!question || typeof question !== 'string') {
      return reject(new ValidationError('question must be a non-empty String'));
    }
    if (type === 'textarea') {
      return resolve({ type, question });
    }
    if (!Array.isArray(choices) || type === 'fillblank' && choices.length === 0 || choices.length < 2) {
      return reject(new ValidationError('choices must be an Array of { value: String, isAnswer: Boolean }.' +
        ' fillblank at least length 1, radio and checkbox at least length 2'));
    }
    const trimmedChoices = choices.map(({ value, isAnswer }) =>
      ({ value: value.trim(), isAnswer: type === 'fillblank' ? true : !!isAnswer }));
    if (choices.some(({ value }) => typeof value !== 'string' || value.length === 0)) {
      return reject(new ValidationError('choice values must be non-empty Strings'));
    }
    if (choices.filter(({ isAnswer }) => isAnswer).length === 0) {
      return reject(new ValidationError('Each question (except textarea) must have at least one answer'));
    }
    return resolve({ type, question, choices: trimmedChoices });
  });
}
