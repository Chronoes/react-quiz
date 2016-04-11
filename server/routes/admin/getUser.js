import { List, fromJS as immutableJS } from 'immutable';

import { User } from '../../database';
import logger from '../../logger';
import { partialPick } from '../../util';

function transformQuestion(selector) {
  return (question) => question.reduce((carry, answer) =>
    carry.update('answer', List.of(carry.get(selector)), (list) => list.push(answer.get(selector))))
  .update((answerMap) => answerMap.has('answer') ? answerMap : answerMap.set('answer', answerMap.get(selector)))
  .delete(selector)
  .delete('questionId');
}

export default (req, res) => {
  const { userId } = req.params;
  const attributes = ['name', 'timeSpent', 'createdAt', 'quizId'];
  return User.scope('withAnswers').findOne({ attributes, where: { id: userId } })
  .then((user) => {
    const userJson = user.toJSON();
    return res.json({ ...partialPick(attributes)(userJson),
      answers: immutableJS(userJson.userChoiceAnswers)
          .map((question) => question.flatten())
          .groupBy(({ questionId }) => questionId)
          .map(transformQuestion('questionChoiceId'))
        .concat(immutableJS(userJson.userTextAnswers)
          .groupBy(({ questionId }) => questionId)
          .map(transformQuestion('value')))
        .toJS(),
    });
  })
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
};
