import { User } from '../../database';
import logger from '../../logger';
import { parseIntBase10, isPositiveNumber } from '../../lib/general';
import { verifyAnswer, validateAnswer, getQuizQuestions } from '../../lib/quiz';
import { saveAnswersToUser } from '../../lib/user';

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
  return User.query('U')
  .first(
    'U.user_id AS userId',
    'U.quiz_id AS quizId'
  ).where('U.hash', userHash)
  .then((user) => {
    if (!user) {
      logger.warn(`No user exists with hash ${userHash}`);
      return res.status(404).json({ message: 'No such user exists.' });
    }
    return Promise.all([
      user,
      getQuizQuestions(user.quizId, true, true),
      User.query()
      .update('time_spent', timeSpent)
      .where('user_id', user.userId),
    ]);
  })
  .then(([user, originalQuestions]) => {
    const validate = validateAnswer(originalQuestions);
    const verify = verifyAnswer(originalQuestions);

    return Promise.all(questions.map((answer) =>
      validate(answer)
      .then(verify)
      .catch((err) => { errors.push(err.message); return err; }))
    ).then((verified) => {
      const normalised = verified.filter((answer) => !(answer instanceof Error));
      return Promise.all([user, normalised, saveAnswersToUser(originalQuestions, normalised, user)]);
    });
  })
  .then(([user, normalisedQuestions]) => {
    if (errors.length > 0) {
      logger.warn(`Errors with user ID ${user.id}: ${errors.join('; ')}`);
    }
    return res.status(201).json({ correctAnswers: normalisedQuestions.filter(({ isCorrect }) => isCorrect).length });
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
};
