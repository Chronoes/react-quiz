import {Quiz} from '../../database';
import logger from '../../logger';

export default (req, res, next) => {
  const {id} = req.params;
  return Quiz.scope('withQuestions').findById(id)
  .then((quiz) => {
    if (quiz === null) {
      return res.status(404).json({message: `No quiz with ID ${id} exists.`});
    }

    if (req.path.split('/').pop() !== `${id}`) {
      req.quiz = quiz;
      return next();
    }
    return res.json(quiz);
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({message: 'Something happened.'});
  });
};
