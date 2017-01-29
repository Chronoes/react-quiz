import logger from '../../logger';
import { partialPick } from '../../util';

export default (req, res) => req.quiz.getUsers()
  .then((users) => res.json(users.map(partialPick(['id', 'name', 'timeSpent', 'createdAt']))))
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
