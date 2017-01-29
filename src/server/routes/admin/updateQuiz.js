import { fromJS as immutableJS } from 'immutable';
import logger from '../../logger';
import { Quiz, Question, QuestionChoice } from '../../database';
import { transformQuizKeys } from '../utilQuiz';

function questionMerger(prev, next, key) {
  if (key === 'questionChoices') {
    return next.map((choice) => {
      const { id: choiceId } = choice;
      if (choiceId !== undefined) {
        const oldChoice = prev.find(({ id }) => id === choiceId);
        if (oldChoice) {
          return oldChoice.merge(choice);
        }
        return choice.delete('id');
      }
      return choice;
    });
  }
  return next;
}

function quizMerger(prev, next, key) {
  if (key === 'questions') {
    return next.map((question) => {
      const { id: questionId } = question;
      if (questionId !== undefined) {
        const oldQuestion = prev.find(({ id }) => id === questionId);
        if (oldQuestion) {
          return oldQuestion.mergeWith(questionMerger, question);
        }
        return question.delete('id');
      }
      return question;
    });
  }
  return next;
}

function saveQuestionChoices(questionId, choices) {
  return Promise.all(choices.map((choice) => {
    if (choice.id) {
      return QuestionChoice.update(choice, { where: { id: choice.id } });
    }
    return QuestionChoice.create(choice)
    .then((newChoice) => newChoice.setQuestion(questionId));
  }));
}

export default (req, res) => {
  const { validatedQuiz, quiz } = req;
  const mergedQuiz = immutableJS(quiz.toJSON())
  .delete('createdAt')
  .delete('updatedAt')
  .mergeWith(quizMerger, validatedQuiz)
  .toJS();
  return quiz.update(mergedQuiz)
  .then(() => Promise.all(mergedQuiz.questions.map((question) => {
    if (question.id) {
      return Question.update(question, { where: { id: question.id } })
      .then(() => saveQuestionChoices(question.id, question.questionChoices || []));
    }
    return quiz.createQuestion(question)
    .then(({ id }) => saveQuestionChoices(id, question.questionChoices || []));
  })))
  .then(() => Quiz.scope('withQuestions').findById(quiz.id))
  .then((newQuiz) => res.json(transformQuizKeys(newQuiz.toJSON())))
  .catch((err) => {
    logger.error(err);
    return res.status(500).json({ message: 'Something happened.' });
  });
};
