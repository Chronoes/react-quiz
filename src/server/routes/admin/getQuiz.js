import { Quiz } from '../../database';
import logger from '../../logger';
import { getQuizQuestions, convertQuizMappings } from '../../lib/quiz';

export function fetchQuiz(req, res, next) {
  const { quizId } = req.params;
  return Quiz.query('Q')
  .first(
    'Q.quiz_id AS quizId',
    'Q.status',
    'Q.title',
    'Q.time_limit AS timeLimit',
    'Q.created_at AS createdAt',
    'Q.updated_at AS updatedAt'
  ).where('quiz_id', quizId)
  .then((quiz) => {
    if (!quiz) {
      return res.status(404).json({ message: `No quiz with ID ${quizId} exists.` });
    }

    return getQuizQuestions(quizId, true, true)
    .then((questions) => {
      req.quiz = { ...quiz, questions };
      return next();
    });
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
}

export default (req, res) => res.json(convertQuizMappings(req.quiz));
