import {Quiz} from '../../database';

export default (req, res) => Quiz.scope('active', 'user', 'withQuestions').findOne()
  .then((quiz) => quiz !== null ? res.json(quiz) : res.status(404).json({message: 'No active quizzes exist.'}))
  .catch((err) => res.status(500).json({message: 'Something happened.'+err}));
