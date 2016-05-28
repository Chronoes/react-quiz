import logger from '../../logger';
import { Quiz, Question } from '../../database';
import { validateQuiz, validateQuestion } from '../utilQuiz';

export default (req, res) => validateQuiz(req.body)
  .then((quiz) => Promise.all(quiz.questions.map(validateQuestion))
    .then((questions) => Promise.resolve(({ ...quiz, questions }))))
  .catch((err) => {
    res.status(400).json({ message: err.message });
    return Promise.reject(err);
  })
  .then((quiz) => Quiz.create({ ...quiz,
    questions: quiz.questions.map(({ choices, ...question }, order) =>
      ({ ...question, order, questionChoices: choices })),
  }, { include: [Question.scope('withChoices')] }))
  .then((quiz) => Quiz.scope('withQuestions').findById(quiz.id))
  .then((quiz) => res.json({ message: 'Quiz created.', quiz }))
  .catch((err) => {
    logger.error(err);
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Something happened.' });
    }
    return err;
  });
