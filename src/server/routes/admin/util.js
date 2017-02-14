import { Quiz } from '../../database';
import logger from '../../logger';
import { getQuizQuestions, validateQuizParams, validateQuestion } from '../../lib/quiz';

export function validateQuiz(req, res, next) {
  return validateQuizParams(req.body)
  .then((quiz) => Promise.all(quiz.questions.map(validateQuestion))
    .then((questions) => Promise.resolve(({
      ...quiz,
      questions: questions.map((question, orderBy) => ({ ...question, orderBy })),
    })))
  ).then((quiz) => {
    req.validatedQuiz = quiz;
    return next();
  })
  .catch((err) => res.status(400).json({ message: err.message }));
}

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
