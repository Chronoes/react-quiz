import { Quiz, User } from '../../database';
import { parseNumberDefault } from '../../lib/general';
import { convertQuizMappings } from '../../lib/quiz';
import logger from '../../logger';

export default (req, res) => {
  const limit = parseNumberDefault(req.query.limit, 18);
  const offset = parseNumberDefault(req.query.offset, 0);
  return Quiz.query('Q')
  .select(
    'Q.quiz_id AS quizId',
    'Q.status',
    'Q.title',
    'Q.time_limit AS timeLimit',
    'Q.created_at AS createdAt',
    'Q.updated_at AS updatedAt'
  )
  .count('U.user_id AS users')
  .leftJoin(`${User} AS U`, 'U.quiz_id', 'Q.quiz_id')
  .groupBy('Q.quiz_id')
  .orderBy('Q.updated_at', 'DESC')
  .limit(limit)
  .offset(offset)
  .then((quizzes) => res.json(quizzes.map(convertQuizMappings)))
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
};
