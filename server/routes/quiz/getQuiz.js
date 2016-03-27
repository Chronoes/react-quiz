import {Quiz, User} from '../../database';
import logger from '../../logger';
import {genChecksum} from '../../util';
import {getChecksumPayload} from './utilQuiz';

// TODO: Questions need a proper order by, set by the admin

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
        .then(() => user.update({hash: genChecksum(getChecksumPayload(user))})))
      .then((user) => {
        logger.log(`Served quiz ID ${quiz.id} to hash ${user.hash}`);
        return res.json({...(quiz.toJSON()), userHash: user.hash});
      });
    }
    logger.warn('No active quizzes');
    return res.status(404).json({message: 'No active quizzes exist.'});
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({message: 'Something happened.'});
  });
};
