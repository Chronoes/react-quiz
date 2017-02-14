import { Router } from 'express';

import {
  getQuizList,
  getQuiz,
  getQuizUsers,
  getUser,
  saveNewQuiz,
  updateQuiz,
} from './admin';
import { fetchQuiz, validateQuiz } from './admin/util';
import { validateIdParam } from '../lib/routing';

const admin = new Router();

// admin.post('/login', loginHandler);
admin.route('/quiz')
.get(getQuizList)
.post(validateQuiz, saveNewQuiz);

admin.param(...validateIdParam('quizId'));

admin.route('/quiz/:quizId')
.get(fetchQuiz, getQuiz)
.put(fetchQuiz, updateQuiz);

admin.get('/quiz/:quizId/users', fetchQuiz, getQuizUsers);


admin.param(...validateIdParam('userId'));

admin.get('/user/:userId', getUser);

export default admin;
