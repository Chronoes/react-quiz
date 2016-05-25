
export default (req, res) => {

  return req.quiz.status === statuses.get(status) ?
    res.json(req.quiz) :
    req.quiz.update({ status: statuses.get(status) })
    .then((quiz) => res.json(quiz));
};
