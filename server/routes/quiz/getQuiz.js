import {Quiz, User} from '../../database';
import logger from '../../logger';

export default (req, res) => {
  const {name = ''} = req.query;
  if (!name) {
    return res.status(400).json({message: 'Missing parameter \'name\''});
  }
  return Quiz.scope('active', 'user', 'withQuestions').findOne()
  .then((quiz) => {
    if (quiz !== null) {
      return User.create({name})
      .then((user) => quiz.addUser(user)
        .then(() => {
          logger.log(`Served quiz ID ${quiz.id}`);
          return res.json({...(quiz.toJSON()), userId: user.id});
        }));
    }
    logger.warn('No active quizzes');
    return res.status(404).json({message: 'No active quizzes exist.'});
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({message: 'Something happened.'});
  });
};
