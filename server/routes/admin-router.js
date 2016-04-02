import {Router} from 'express';
import getQuizListHandler from './admin/getQuizList';
const admin = new Router();

// admin.post('/login', loginHandler);
admin.route('/quiz')
.get(getQuizListHandler);

export default admin;
