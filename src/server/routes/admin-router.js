import { Router } from 'express';

import getQuizList from './admin/getQuizList';
import getQuiz, { fetchQuiz } from './admin/getQuiz';
import getQuizUsers from './admin/getQuizUsers';
import getUser from './admin/getUser';
import saveNewQuiz from './admin/saveNewQuiz';
import updateQuiz from './admin/updateQuiz';

import { parseIntBase10, isPositiveNumber } from '../lib/general';
import { validateQuiz } from '../lib/quiz';

const admin = new Router();

// admin.post('/login', loginHandler);
admin.route('/quiz')
.get(getQuizList)
.post(validateQuiz, saveNewQuiz);

export function validateIdParam(name) {
  return [name, (req, res, next) => {
    const id = parseIntBase10(req.params[name]);
    if (!isPositiveNumber(id)) {
      return res.status(400).json({ message: `Invalid ID parameter: ${req.params[name]}` });
    }
    req.params[name] = id;
    return next();
  }];
}

admin.param(...validateIdParam('quizId'));

admin.route('/quiz/:quizId')
.get(fetchQuiz, getQuiz)
.patch(fetchQuiz, updateQuiz);

admin.get('/quiz/:quizId/users', fetchQuiz, getQuizUsers);

admin.param(...validateIdParam('userId'));

admin.get('/user/:userId', getUser);

export default admin;
