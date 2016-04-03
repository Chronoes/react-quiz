import {Quiz} from '../../database';
import logger from '../../logger';

export default (req, res) => {
  const {id} = req.params;
  return Quiz.scope('withQuestions').findById(id)
  .then((quiz) => {
    if (quiz === null) {
      return res.status(404).json({message: `No quiz with ID ${id} exists.`});
    }
    return res.json(quiz);
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({message: 'Something happened.'});
  });
};
