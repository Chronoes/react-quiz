import {Router} from 'express';

import getQuizHandler from './quiz/getQuiz';
import saveQuizAnswersHandler from './quiz/saveQuizAnswers';

const quiz = new Router();

quiz.route('/')
  .get(getQuizHandler)
  .post(saveQuizAnswersHandler);

export default quiz;
