import { Quiz } from '../../database';
import logger from '../../logger';

export default (req, res, next) => {
  const { quizId } = req.params;
  return Quiz.scope('withQuestions').findById(quizId)
  .then((quiz) => {
    if (quiz === null) {
      return res.status(404).json({ message: `No quiz with ID ${quizId} exists.` });
    }

    if (req.path.split('/').pop() !== `${quizId}`) {
      req.quiz = quiz;
      return next();
    }
    return res.json(quiz);
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
};
