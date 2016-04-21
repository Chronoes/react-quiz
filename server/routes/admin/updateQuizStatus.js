import { Quiz } from '../../database';
const { statuses } = Quiz.mappings;

export default (req, res, next) => {
  const { status = null } = req.body;
  if (status === null) {
    return next();
  }
  if (!statuses.has(status)) {
    return res.status(400).json({ message: `Status query parameter must be one of [${statuses.keySeq().toArray()}].` });
  }
  return req.quiz.status === statuses.get(status) ?
    res.json(req.quiz) :
    req.quiz.update({ status: statuses.get(status) })
    .then((quiz) => res.json(quiz));
};
