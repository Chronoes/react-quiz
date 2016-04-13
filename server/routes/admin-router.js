import { Router } from 'express';

import getQuizList from './admin/getQuizList';
import getQuiz from './admin/getQuiz';
import getQuizUsers from './admin/getQuizUsers';
import getUser from './admin/getUser';

import { parseIntBase10, isPositiveNumber } from '../util';

const admin = new Router();

// admin.post('/login', loginHandler);
admin.route('/quiz')
.get(getQuizList);

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
.get(getQuiz);
// .post(saveQuizHandler)
// .put();

admin.get('/quiz/:quizId/users', getQuiz, getQuizUsers);

admin.param(...validateIdParam('userId'));

admin.get('/user/:userId', getUser);

export default admin;
