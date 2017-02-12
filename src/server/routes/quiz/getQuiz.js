import { Quiz } from '../../database';
import logger from '../../logger';
import { createUser } from '../../lib/user';
import { getQuizQuestions, convertQuizMappings } from '../../lib/quiz';

const { statuses } = Quiz.mappings;

export default (req, res) => {
  const { name = '' } = req.query;
  if (!name) {
    return res.status(400).json({ message: 'Missing parameter \'name\'' });
  }
  return Quiz.query('Q')
  .first(
    'Q.quiz_id AS quizId',
    'Q.title',
    'Q.time_limit AS timeLimit'
  ).where('status', statuses.get('active'))
  .then((quiz) => {
    if (!quiz) {
      logger.warn('No active quizzes');
      return res.status(404).json({ message: 'No active quizzes exist.' });
    }
    return createUser(name, quiz.quizId)
    .then((user) => getQuizQuestions(quiz.quizId)
      .then((questions) => {
        logger.log(`Served quiz ID ${quiz.quizId} to hash ${user.hash}`);
        return res.json({
          ...(convertQuizMappings({ ...quiz, questions })),
          userHash: user.hash,
        });
      }));
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
};
