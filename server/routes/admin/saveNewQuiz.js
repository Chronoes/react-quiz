import logger from '../../logger';
import { Quiz, Question } from '../../database';
import { transformQuizKeys } from '../utilQuiz';

export default ({ validatedQuiz }, res) => Quiz.create(validatedQuiz, { include: [Question.scope('withChoices')] })
  .then((quiz) => Quiz.scope('withQuestions').findById(quiz.id))
  .then((quiz) => res.json(transformQuizKeys(quiz.toJSON())))
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
