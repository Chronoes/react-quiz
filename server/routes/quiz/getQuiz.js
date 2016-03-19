import {Quiz} from '../../database';

export default (req, res) => Quiz.scope('active').findOne()
  .then((quiz) => quiz !== null ? res.json({quiz}) : res.status(404).json({message: 'No active quizzes exist.'}))
  .catch(() => res.status(500).json({message: 'Something happened.'}));
