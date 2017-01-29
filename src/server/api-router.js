import { Router } from 'express';
import quizRouter from './routes/quiz-router';
import adminRouter from './routes/admin-router';

const api = new Router();

/*
 * TODO: Save new quiz to database
 * TODO: Change existing quiz
 * TODO: Activate a quiz
 * TODO: Passivate a quiz
 * TODO: Set user answer status (if it is correct after verification)
 * TODO: Document the API for personal use somewhere
*/

// Consider rate limiting this route
api.use('/quiz', quizRouter);

// TODO: Implement JWT authentication
api.use((req, res, next) => next());

api.use('/admin', adminRouter);

export default api;
