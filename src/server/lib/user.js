import { fromJS as immutableJS } from 'immutable';

import database, { User, UserTextAnswer, UserChoiceAnswer, Question } from '../database';
import { genChecksum } from '../lib/general';

const { questionTypes } = Question.mappings;

export function createUser(username, quizId) {
  return User.query()
  .insert({ username, quiz_id: quizId }, 'user_id')
  .then(([userId]) => User.query('U')
    .first('U.user_id AS userId', 'U.created_at AS createdAt')
    .where('U.user_id', userId))
  .then(({ userId, createdAt }) => {
    const hash = genChecksum({ id: userId, createdAt });
    return User.query()
    .update('hash', hash)
    .then(() => Promise.resolve({ userId, hash }));
  });
}

function saveTextAnswer(transaction, user) {
  return (questionId, { value, isCorrect }) =>
    transaction
    .insert({
      user_id: user.userId,
      question_id: questionId,
      value,
      is_correct: isCorrect,
    })
    .into(UserTextAnswer.name);
}

function saveChoiceAnswer(transaction, user) {
  return (choiceId, { isCorrect }) =>
    transaction
    .insert({
      user_id: user.userId,
      question_choice_id: choiceId,
      is_correct: isCorrect,
    })
    .into(UserChoiceAnswer.name);
}

export function saveAnswersToUser(questionsRaw, answers, user) {
  const questions = immutableJS(questionsRaw);

  return database.transaction((transaction) => {
    const textAnswer = saveTextAnswer(transaction, user);
    const choiceAnswer = saveChoiceAnswer(transaction, user);

    return Promise.all(answers.map(({ questionId, answer, isCorrect }) => {
      const { type } = questions.find(({ id }) => id === questionId);

      if (type === questionTypes.get('textarea')) {
        return textAnswer(questionId, { value: answer, isCorrect: null });
      } else if (type === questionTypes.get('fillblank')) {
        return Promise.all(answer.map((value) => textAnswer(questionId, { value, isCorrect })));
      } else if (type === questionTypes.get('checkbox')) {
        return Promise.all(answer.map((choiceId) => choiceAnswer(choiceId, { isCorrect })));
      }
      return choiceAnswer(answer, { isCorrect });
    }));
  });
}
