import {isInvalidDatabaseId, parseIntBase10} from '../../util';

export class ValidationError extends Error {}

export function getChecksumPayload({id, createdAt}) {
  return {id, createdAt};
}

export function isChoiceAnswer(choices) {
  return (answer) => !!(choices[answer] && choices[answer].isAnswer);
}

export function mapQuestionsById(questions) {
  const mappedQuestions = {};
  questions.forEach(({id, question_choices, ...other}) => {
    const choices = {};
    question_choices.forEach(({id: choiceId, ...values}) => { choices[choiceId] = values; });
    mappedQuestions[id] = {choices, ...other};
  });
  return mappedQuestions;
}

export function validateAnswer(questions) {
  return (userAnswer) => new Promise((resolve, reject) => {
    if (typeof userAnswer !== 'object') {
      return reject(new ValidationError('User answer must be an object'));
    }
    const {id = 0, answer = null} = userAnswer;
    const questionId = parseIntBase10(id);
    if (isInvalidDatabaseId(questionId) || answer === null) {
      return reject(new ValidationError('User answer format: {id: Number, answer: Number || String || Array}'));
    }
    if (!questions[questionId]) {
      return reject(new ValidationError(`Question ID ${questionId} does not exist`));
    }
    const {type} = questions[questionId];
    const error = {expected: ''};
    if (type === 'checkbox') {
      if (!Array.isArray(answer)) {
        error.expected = 'Array of Numbers';
      } else {
        const answers = answer.map(parseIntBase10);
        if (answers.some(isInvalidDatabaseId)) {
          error.expected = 'Array of Numbers';
        } else {
          return resolve({questionId, answer: answers});
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
        return resolve({questionId, answer: parsed});
      }
    }

    if (error.expected) {
      return reject(new ValidationError(
        `Malformed user answer '${answer}': expected ${error.expected} for type ${type}, question ID ${questionId}`));
    }
    return resolve({questionId, answer});
  });
}

export function verifyAnswer(questions) {
  return ({answer, questionId}) => new Promise((resolve) => {
    const {type, choices} = questions[questionId];
    const boundIsChoiceAnswer = isChoiceAnswer(choices);
    const resolvable = {questionId, answer, isCorrect: null};
    if (type === 'radio') {
      return resolve({...resolvable, isCorrect: boundIsChoiceAnswer(answer)});
    } else if (type === 'checkbox') {
      if (answer.length === 0) {
        return resolve({...resolvable, isCorrect: false});
      }
      return resolve({...resolvable, isCorrect: answer.every(boundIsChoiceAnswer)});
    } else if (type === 'fillblank') {
      if (answer.length === 0) {
        return resolve({...resolvable, isCorrect: false});
      }
      const choiceList = Object.keys(choices);
      return resolve({...resolvable,
        isCorrect: answer.every((a) => choiceList.some((key) => choices[key].value === a.trim())),
      });
    }
    return resolve(resolvable);
  });
}
