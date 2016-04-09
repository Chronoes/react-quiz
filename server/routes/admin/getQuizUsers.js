import logger from '../../logger';

export default (req, res) => req.quiz.getUsers()
  .then((users) => res.json(users.map(({id, name, timeSpent, createdAt}) => ({id, name, timeSpent, createdAt}))))
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({message: 'Something happened.'});
  });
