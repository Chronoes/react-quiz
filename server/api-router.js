import {Router} from 'express';
import quizRouter from './routes/quiz-router';
import adminRouter from './routes/admin-router';

const api = new Router();


api.use('/quiz', quizRouter);

// TODO: Implement JWT authentication
api.use((req, res, next) => next());

api.use('/admin', adminRouter);

export default api;
