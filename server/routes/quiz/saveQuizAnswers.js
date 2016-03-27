import {Quiz, User} from '../../database';
import logger from '../../logger';

export function isChoiceAnswer(choices, answer) {
  return choices[answer] && choices[answer].isAnswer || false;
}

export function validateAnswers(questions, userAnswers) {
  const mappedQuestions = {};
  questions.forEach(({id, question_choices, ...other}) => {
    const choices = {};
    question_choices.forEach(({id: choiceId, ...values}) => { choices[choiceId] = values; });
    mappedQuestions[id] = {choices, ...other};
  });
  return userAnswers.map((userAnswer) =>
    new Promise((resolve, reject) => {
      if (typeof userAnswer !== 'object') {
        return reject(null);
      }
      const {id = 0, answer = null} = userAnswer;
      const questionId = parseInt(id, 10);
      if (isNaN(questionId) || questionId <= 0 || answer === null) {
        return reject(null);
      }
      if (!mappedQuestions[questionId]) {
        return reject(null);
      }

      const {type, choices} = mappedQuestions[questionId];
      switch (type) {
        case 'textarea':
          return resolve(false);
        case 'radio':
          return resolve(isChoiceAnswer(choices, answer));
        case 'checkbox':
          if (!Array.isArray(answer)) {
            return reject(null);
          }
          return resolve(answer.map((a) => isChoiceAnswer(choices, a)).every((a) => a));
        default:
          return reject(null);
      }
    }));
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
  if (questions.length === 0) {
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
    const validated = validateAnswers(user.toJSON().quiz.questions, questions);
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({message: 'Something happened.'});
  });
};
