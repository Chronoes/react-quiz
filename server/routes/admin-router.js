import {Router} from 'express';

import getQuizListHandler from './admin/getQuizList';
import getQuizHandler from './admin/getQuiz';

import {parseIntBase10, isInvalidDatabaseId} from '../util';

const admin = new Router();

// admin.post('/login', loginHandler);
admin.route('/quiz')
.get(getQuizListHandler);

export function validateIdParam(req, res, next) {
  const id = parseIntBase10(req.params.id);
  if (isInvalidDatabaseId(id)) {
    return res.status(400).json({message: 'Invalid ID parameter'});
  }
  req.params.id = id;
  return next();
}

admin.use(validateIdParam);

admin.route('/quiz/:id')
.get(getQuizHandler);
// .post(saveQuizHandler)
// .put();

export default admin;
