import { isPositiveNumber, parseIntBase10 } from '../../util';
import { Seq, fromJS as immutableJS } from 'immutable';

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
      return resolve({ ...resolvable,
        isCorrect: new Seq(questionChoices)
        .sort()
        .map(({ value }) => value)
        .equals(new Seq(answer.map((ans) => ans.trim()))),
      });
    }
    return resolve(resolvable);
  });
}
