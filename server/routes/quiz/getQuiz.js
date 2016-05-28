import { Quiz, User } from '../../database';
import logger from '../../logger';
import { genChecksum, partialPick, partialOmit } from '../../util';

export default (req, res) => {
  const { name = '' } = req.query;
  if (!name) {
    return res.status(400).json({ message: 'Missing parameter \'name\'' });
  }
  return Quiz.scope('active', 'user', 'withQuestions').findOne()
  .then((quiz) => {
    if (quiz === null) {
      logger.warn('No active quizzes');
      return res.status(404).json({ message: 'No active quizzes exist.' });
    }
    return User.create({ username: name })
    .then((user) => quiz.addUser(user)
      .then(() => user.update({ hash: genChecksum({ id: user.id, createdAt: user.createdAt }) })))
    .then((user) => {
      logger.log(`Served quiz ID ${quiz.id} to hash ${user.hash}`);
      const quizJson = partialOmit(['status'])(quiz.toJSON());
      return res.json({ ...quizJson,
        questions: quizJson.questions
          .map(partialPick(['id', 'type', 'question', 'order', ['questionChoices', 'choices']]))
          .map((question) => ({ ...question, choices: question.choices.map(partialPick(['id', 'value'])) })),
        userHash: user.hash,
      });
    });
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
};
