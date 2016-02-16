'use !extensible';
import {fromJS as immutableJS} from 'immutable';

const questionFormat = immutableJS({
  id: 0,
  type: 'radio',
  question: '',
  choices: [{id: 0, value: ''}],
  userAnswers: [],
});

const quizState = immutableJS({
  id: 0,
  title: 'Test',
  isRunning: false,
  resultsSent: false,
  timeLimit: 0,
  timeSpent: 0,
  userId: 0,
  questions: [],
  correctAnswers: 0,
});

export default function quiz(state = quizState, {type, ...action}) {
  switch (type) {
    case 'SET_USER_ANSWER':
      return state.setIn(['questions', action.questionIdx, 'userAnswers', 0], action.answer);
    case 'SET_USER_MULTI_ANSWER':
      return state.setIn(['questions', action.questionIdx, 'userAnswers', action.answerIdx], action.answer);
    case 'GET_QUIZ_SUCCESS':
      return state.set('isRunning', true)
        .mergeWith((prev, next, key) => {
          return key === 'questions' ? next.map(question => questionFormat.mergeDeep(question)) : next;
        }, action.quiz);
    case 'GET_QUIZ_ERROR':
      return state;
    case 'TIME_STOP':
      return state.set('timeSpent', action.time).set('isRunning', false);
    case 'FINISH_QUIZ':
      return state.set('isRunning', false);
    case 'SEND_RESULTS':
      return state.set('resultsSent', true);
    case 'SEND_RESULTS_SUCCESS':
      return state.set('correctAnswers', action.correctAnswers);
    case 'SET_TITLE':
      return state.set('title', action.title);
    case 'ADD_QUESTION':
      return state.update('questions', questions => questions.push(questionFormat.set('type', action.questionType)));
    case 'DELETE_QUESTION':
      return state.deleteIn(['questions', action.idx]);
    case 'RESET_QUIZ_STATE':
      return quizState;
    default:
      return state;
  }
}
