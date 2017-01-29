import { Router } from 'express';

import getQuiz from './quiz/getQuiz';
import saveQuizAnswers from './quiz/saveQuizAnswers';

const quiz = new Router();

quiz.route('/')
  .get(getQuiz)
  .post(saveQuizAnswers);

export default quiz;
