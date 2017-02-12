import { fromJS as immutableJS } from 'immutable';
import database, { Quiz, User } from '../../database';
import logger from '../../logger';
import { parseIntBase10, isPositiveNumber } from '../../lib/general';
import { verifyAnswer, validateAnswer } from '../../lib/quiz';

function saveTextAnswer(transaction, user) {
  return (relationId) => (values) =>
    user.createUserTextAnswer(values, { transaction })
    .then((textAnswer) => textAnswer.setQuestion(relationId, { transaction }));
}

function saveChoiceAnswer(transaction, user) {
  return (values) => (relationId) =>
    user.createUserChoiceAnswer(values, { transaction })
    .then((choiceAnswer) => choiceAnswer.setQuestionChoice(relationId, { transaction }));
}

export function saveAnswersToUser(questionsRaw, answers, user) {
  const questions = immutableJS(questionsRaw);
  return database.transaction((transaction) => {
    const boundSaveTextAnswer = saveTextAnswer(transaction, user);
    const boundSaveChoiceAnswer = saveChoiceAnswer(transaction, user);
    return Promise.all(answers.map(({ questionId, answer, isCorrect }) => {
      const { type } = questions.find(({ id }) => id === questionId);
      const textAnswer = boundSaveTextAnswer(questionId);
      const choiceAnswer = boundSaveChoiceAnswer({ isCorrect });
      if (type === 'textarea') {
        return textAnswer({ value: answer, isCorrect: null });
      } else if (type === 'fillblank') {
        return Promise.all(answer.map((value) => textAnswer({ value, isCorrect })));
      } else if (type === 'checkbox') {
        return Promise.all(answer.map(choiceAnswer));
      }
      return choiceAnswer(answer);
    }));
  });
}

export default (req, res) => {
  const { userHash = '', questions = [] } = req.body;
  const errors = [];
  if (userHash.length === 0) {
    errors.push('userHash must be a hash String');
  }
  const timeSpent = parseIntBase10(req.body.timeSpent);
  if (!isPositiveNumber(timeSpent)) {
    errors.push('timeSpent must be a positive Number');
  }
  if (Array.isArray(questions) && questions.length === 0) {
    errors.push('questions must be an Array with length of at least 1');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Request validation failed.', errors });
  }
  return User.findOne({ where: { hash: userHash }, include: [Quiz.scope('withQuestions')] })
  .then((user) => {
    if (user === null) {
      logger.warn(`No user exists with hash ${userHash}`);
      return res.status(404).json({ message: 'No such user exists.' });
    }
    const originalQuestions = user.toJSON().quiz.questions;
    const validate = validateAnswer(originalQuestions);
    const verify = verifyAnswer(originalQuestions);
    return user.update({ timeSpent })
    .then(() => Promise.all(questions.map((answer) =>
      validate(answer)
      .then(verify)
      .catch((err) => { errors.push(err.message); return err; }))))
    .then((verified) => Promise.resolve(verified.filter((answer) => !(answer instanceof Error))))
    .then((normalised) => saveAnswersToUser(originalQuestions, normalised, user)
      .then(() => {
        if (errors.length > 0) {
          logger.warn(`Errors with user ID ${user.id}: ${errors.join('; ')}`);
        }
        return res.status(201).json({ correctAnswers: normalised.filter(({ isCorrect }) => isCorrect).length });
      }));
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
};
