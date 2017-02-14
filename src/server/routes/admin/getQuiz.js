import { convertQuizMappings } from '../../lib/quiz';

export default (req, res) => res.json(convertQuizMappings(req.quiz));
