import {Router} from 'express';

import getQuizList from './admin/getQuizList';
import getQuiz from './admin/getQuiz';
import getQuizUsers from './admin/getQuizUsers';

import {parseIntBase10, isInvalidDatabaseId} from '../util';

const admin = new Router();

// admin.post('/login', loginHandler);
admin.route('/quiz')
.get(getQuizList);

export function validateIdParam(req, res, next) {
  const id = parseIntBase10(req.params.id);
  if (isInvalidDatabaseId(id)) {
    return res.status(400).json({message: `Invalid ID parameter: ${req.params.id}`});
  }
  req.params.id = id;
  return next();
}

admin.param('id', validateIdParam);

admin.route('/quiz/:id')
.get(getQuiz);
// .post(saveQuizHandler)
// .put();

admin.get('/quiz/:id/users', getQuiz, getQuizUsers);

export default admin;
