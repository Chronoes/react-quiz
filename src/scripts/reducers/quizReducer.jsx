import { fromJS as immutableJS } from 'immutable';

const questionFormat = immutableJS({
  id: 0,
  type: 'radio',
  question: '',
  choices: [],
  userAnswer: '',
  userAnswers: [],
});

const quizState = immutableJS({
  id: 0,
  userHash: 0,
  title: 'Test',
  isRunning: false,
  resultsSent: false,
  timeLimit: 0,
  timeSpent: 0,
  questions: [],
  correctAnswers: 0,
});

export default function quiz(state = quizState, { type, ...action }) {
  switch (type) {
    case 'SET_USER_ANSWER':
      return state.setIn(['questions', action.idx, 'userAnswer'], action.answer);
    case 'SET_USER_ANSWER_CHECKBOX':
      return state.updateIn(['questions', action.idx, 'userAnswers'], (list) => {
        const { answer } = action;
        const index = list.indexOf(answer);
        return index === -1 ? list.push(answer) : list.delete(index);
      });
    case 'SET_USER_ANSWER_FILLBLANK':
      return state.setIn(['questions', action.idx, 'userAnswers', action.answerIdx], action.answer);
    case 'GET_QUIZ_SUCCESS':
      return state.set('isRunning', true)
        .mergeWith((prev, next, key) => key === 'questions' ?
          next.map((question) => questionFormat.mergeDeep(question)) : next, action.quiz);
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
    default:
      return state;
  }
}
