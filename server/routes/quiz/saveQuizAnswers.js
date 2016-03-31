import database, {Quiz, User} from '../../database';
import logger from '../../logger';

// TODO: Clean up this file

class ValidationError extends Error {}

export function isChoiceAnswer(choices, answer) {
  return choices[answer] && choices[answer].isAnswer && true || false;
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

export function isInvalidId(value) {
  return isNaN(value) || value <= 0;
}

export function validateAnswer(userAnswer, questions) {
  if (typeof userAnswer !== 'object') {
    throw new ValidationError('userAnswer must be an object');
  }
  const parseIntBase10 = (nr) => parseInt(nr, 10);
  const {id = 0, answer = null} = userAnswer;
  const questionId = parseIntBase10(id);
  if (isInvalidId(questionId) || answer === null) {
    throw new ValidationError('userAnswer format: {id: Number, answer: Number || String || Array}');
  }
  if (!questions[questionId]) {
    throw new ValidationError(`Question ID ${questionId} does not exist`);
  }
  const {type} = questions[questionId];
  const error = {expected: ''};
  if (type === 'checkbox') {
    if (!Array.isArray(answer)) {
      error.expected = 'Array of Numbers';
    } else {
      const answers = answer.map(parseIntBase10);
      if (answers.some(isInvalidId)) {
        error.expected = 'Array of Numbers';
      } else {
        return {questionId, answer: answers};
      }
    }
  } else if (type === 'fillblank') {
    if (Array.isArray(answer) && answer.some((value) => typeof value !== 'string')) {
      error.expected = 'Array of Strings';
    }
  } else if (type === 'textarea' && typeof answer !== 'string') {
    error.expected = 'String';
  } else if (type === 'radio') {
    const parsed = parseIntBase10(answer);
    if (isInvalidId(parsed)) {
      error.expected = 'Number';
    } else {
      return {questionId, answer: parsed};
    }
  }

  if (error.expected) {
    throw new ValidationError(
      `Malformed answer '${answer}': expected ${error.expected} for type ${type}, question ID ${questionId}`);
  }
  return {questionId, answer};
}

export function normaliseAnswers(questions, userAnswers) {
  return userAnswers.map((userAnswer) =>
    new Promise((resolve, reject) => {
      try {
        const {answer, questionId} = validateAnswer(userAnswer, questions);
        const {type, choices} = questions[questionId];
        const resolvable = {questionId, answer, isCorrect: null};
        if (type === 'textarea') {
          return resolve(resolvable);
        } else if (type === 'radio') {
          return resolve({...resolvable, isCorrect: isChoiceAnswer(choices, answer)});
        } else if (type === 'checkbox') {
          const checkedAnswers = answer.map((a) => isChoiceAnswer(choices, a));
          return resolve({...resolvable,
            isCorrect: checkedAnswers.length > 0 && checkedAnswers.every((a) => a) && true || false});
        } else if (type === 'fillblank') {
          return resolve(resolvable);
        }
        throw new ValidationError(`No such question type ${type} is implemented`);
      } catch (err) {
        return reject(err);
      }
    }));
}

function saveTextAnswer(transaction, user) {
  return (relationId) => (values) =>
    user.createTextAnswer(values, {transaction})
    .then((textAnswer) => textAnswer.setTextAnswer(relationId, {transaction}));
}

function saveChoiceAnswer(transaction, user) {
  return (values) => (relationId) =>
    user.createChoiceAnswer(values, {transaction})
    .then((choiceAnswer) => choiceAnswer.setChoiceAnswer(relationId, {transaction}));
}

export function saveAnswersToUser(questions, answers, user) {
  return database.transaction((transaction) => Promise.all(answers.map(({questionId, answer, isCorrect}) => {
    const {type} = questions[questionId];
    const textAnswer = saveTextAnswer(transaction, user)(questionId);
    const choiceAnswer = saveChoiceAnswer(transaction, user)({isCorrect});
    if (type === 'textarea') {
      return textAnswer({value: answer, isCorrect: null});
    } else if (type === 'fillblank') {
      return Promise.all(answer.map((value) => textAnswer({value, isCorrect})));
    } else if (type === 'checkbox') {
      return Promise.all(answer.map(choiceAnswer));
    }
    return choiceAnswer(answer);
  }
  )));
}

export default (req, res) => {
  const {userHash = '', timeSpent = 0, questions = []} = req.body;
  const errors = [];
  if (userHash.length === 0) {
    errors.push('userHash must be a hash string');
  }
  if (timeSpent <= 0) {
    errors.push('timeSpent must be a positive integer');
  }
  if (!Array.isArray(questions) || questions.length === 0) {
    errors.push('questions must be an array of length at least 1');
  }

  if (errors.length > 0) {
    return res.status(400).json({message: 'Request validation failed.', errors});
  }
  return User.findOne({where: {hash: userHash}, include: [Quiz.scope('withQuestions')]})
  .then((user) => {
    if (user === null) {
      logger.warn(`No user exists with hash ${userHash}`);
      return res.status(404).json({message: 'No such user exists.'});
    }
    const originalQuestions = mapQuestionsById(user.toJSON().quiz.questions);
    return Promise.all(
      normaliseAnswers(originalQuestions, questions)
      .map((answer) => answer.catch((err) => { errors.push(err.message); return err; })))
    .then((validated) => Promise.resolve(validated.filter((answer) => !(answer instanceof Error))))
    .then((filtered) => saveAnswersToUser(originalQuestions, filtered, user)
      .then(() => {
        if (errors.length > 0) {
          logger.warn(`Errors with user ID ${user.id}: ${errors.join('; ')}`);
        }
        return res.json({correctAnswers: filtered.filter(({isCorrect}) => isCorrect).length});
      }));
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({message: 'Something happened.'});
  });
};
