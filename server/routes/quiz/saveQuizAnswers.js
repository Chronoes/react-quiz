import database, {Quiz, User} from '../../database';
import logger from '../../logger';
import {mapQuestionsById, verifyAnswer, validateAnswer} from './utilQuiz';

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
  return database.transaction((transaction) => {
    const boundSaveTextAnswer = saveTextAnswer(transaction, user);
    const boundSaveChoiceAnswer = saveChoiceAnswer(transaction, user);
    return Promise.all(answers.map(({questionId, answer, isCorrect}) => {
      const {type} = questions[questionId];
      const textAnswer = boundSaveTextAnswer(questionId);
      const choiceAnswer = boundSaveChoiceAnswer({isCorrect});
      if (type === 'textarea') {
        return textAnswer({value: answer, isCorrect: null});
      } else if (type === 'fillblank') {
        return Promise.all(answer.map((value) => textAnswer({value, isCorrect})));
      } else if (type === 'checkbox') {
        return Promise.all(answer.map(choiceAnswer));
      }
      return choiceAnswer(answer);
    }));
  });
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
    const validate = validateAnswer(originalQuestions);
    const verify = verifyAnswer(originalQuestions);
    return Promise.all(questions.map((answer) =>
      validate(answer)
      .then(verify)
      .catch((err) => { errors.push(err.message); return err; })))
    .then((verified) => Promise.resolve(verified.filter((answer) => !(answer instanceof Error))))
    .then((normalised) => saveAnswersToUser(originalQuestions, normalised, user)
      .then(() => {
        if (errors.length > 0) {
          logger.warn(`Errors with user ID ${user.id}: ${errors.join('; ')}`);
        }
        return res.json({correctAnswers: normalised.filter(({isCorrect}) => isCorrect).length});
      }));
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({message: 'Something happened.'});
  });
};
