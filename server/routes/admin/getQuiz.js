import { Quiz } from '../../database';
import logger from '../../logger';
import { transformQuizKeys } from '../utilQuiz';

export function fetchQuiz(req, res, next) {
  const { quizId } = req.params;
  return Quiz.scope('withQuestions').findById(quizId)
  .then((quiz) => {
    if (quiz === null) {
      return res.status(404).json({ message: `No quiz with ID ${quizId} exists.` });
    }

    req.quiz = quiz;
    return next();
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
}

export default (req, res) => res.json(transformQuizKeys(req.quiz.toJSON()));
