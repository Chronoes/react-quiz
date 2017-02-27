import { User } from '../../database';
import logger from '../../logger';

export default (req, res) => User.query('U')
  .select(
    'U.user_id AS userId',
    'U.username',
    'U.time_spent AS timeSpent',
    'U.created_at AS createdAt'
  ).where('U.quiz_id', req.params.quizId)
  .orderBy('U.username', 'ASC')
  .then((users) => res.json(users))
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
