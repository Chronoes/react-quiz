import { isInvalidDatabaseId, parseIntBase10 } from '../../util';
import { Seq } from 'immutable';

export class ValidationError extends Error {}

export function mapQuestionsById(questions) {
  const mappedQuestions = {};
  questions.forEach(({ id, questionChoices, ...other }) => {
    const choices = {};
    questionChoices.forEach(({ id: choiceId, ...values }) => { choices[choiceId] = values; });
    mappedQuestions[id] = { choices, ...other };
  });
  return mappedQuestions;
}

export function validateAnswer(questions) {
  return (userAnswer) => new Promise((resolve, reject) => {
    if (typeof userAnswer !== 'object') {
      return reject(new ValidationError('User answer must be an object'));
    }
    const { id = 0, answer = null } = userAnswer;
    const questionId = parseIntBase10(id);
    if (isInvalidDatabaseId(questionId) || answer === null) {
      return reject(new ValidationError('User answer format: {id: Number, answer: Number || String || Array}'));
    }
    if (!questions[questionId]) {
      return reject(new ValidationError(`Question ID ${questionId} does not exist`));
    }
    const { type } = questions[questionId];
    const error = { expected: '' };
    if (type === 'checkbox') {
      if (!Array.isArray(answer)) {
        error.expected = 'Array of Numbers';
      } else {
        const answers = answer.map(parseIntBase10);
        if (answers.some(isInvalidDatabaseId)) {
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
      if (isInvalidDatabaseId(parsed)) {
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

export function verifyAnswer(questions) {
  return ({ answer, questionId }) => new Promise((resolve) => {
    const { type, choices } = questions[questionId];
    const resolvable = { questionId, answer, isCorrect: null };
    if (type === 'radio') {
      return resolve({ ...resolvable, isCorrect: !!(choices[answer] && choices[answer].isAnswer) });
    } else if (type === 'checkbox') {
      const choiceSeq = new Seq(choices).filter((value) => value.isAnswer).cacheResult();
      const answerSeq = new Seq.Set(answer);
      return resolve({ ...resolvable,
        isCorrect: choiceSeq.count() === answerSeq.count() &&
          choiceSeq.keySeq()
          .map(parseIntBase10)
          .toSetSeq()
          .equals(answerSeq),
      });
    } else if (type === 'fillblank') {
      return resolve({ ...resolvable,
        isCorrect: new Seq(choices)
        .sort()
        .map((choice) => choice.value)
        .valueSeq()
        .equals(new Seq(answer.map((ans) => ans.trim()))),
      });
    }
    return resolve(resolvable);
  });
}
