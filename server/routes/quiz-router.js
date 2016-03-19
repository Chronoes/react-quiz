import {Router} from 'express';

import getQuizHandler from './quiz/getQuiz';

const quiz = new Router();

quiz.route('/')
  .get(getQuizHandler);
  // .post(saveAnswersHandler);

export default quiz;
