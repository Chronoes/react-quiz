'use !extensible';
import {fromJS as immutableJS, Map} from 'immutable';

const choiceFormat = new Map({id: 0, value: ''});

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
  title: 'Test',
  isRunning: false,
  resultsSent: false,
  timeLimit: 0,
  timeSpent: 0,
  userId: 0,
  questions: [],
  editingQuestion: 0,
  correctAnswers: 0,
});

function admin(state, type, action) {
  switch (type) {
    case 'SET_TITLE':
      return state.set('title', action.title);
    case 'ADD_QUESTION':
      return state.set('editingQuestion', state.get('questions').size)
        .update('questions',
          questions => questions.push(
            questionFormat.set('id', questions.size).set('type', action.questionType).set('question', action.title))
        );
    case 'SET_QUESTION_TITLE':
      return state.setIn(['questions', state.get('editingQuestion'), 'question'], action.title);
    case 'SET_CHOICES':
      return state.setIn(['questions', state.get('editingQuestion'), 'choices'],
        action.choices.map((value, i) => choiceFormat.set('id', i).set('value', value))
      );
    case 'EDIT_QUESTION':
      return state.set('editingQuestion', action.idx);
    case 'MOVE_QUESTION':
      return state.update('questions', questions => questions.delete(action.idx)
        .insert(action.direction === 'up' ? action.idx - 1 : action.idx + 1, questions.get(action.idx))
      );
    case 'DELETE_QUESTION':
      return state.deleteIn(['questions', action.idx]).update('editingQuestion', value => value - 1);
    case 'RESET_QUIZ_STATE':
      return quizState;
    default:
      return state;
  }
}

export default function quiz(state = quizState, {type, ...action}) {
  switch (type) {
    case 'SET_USER_ANSWER':
      return state.setIn(['questions', action.questionIdx, 'userAnswer'], action.answer);
    case 'SET_USER_ANSWER_CHECKBOX':
      return state.updateIn(['questions', action.questionIdx, 'userAnswers'], list => {
        const {answer} = action;
        const index = list.indexOf(answer);
        return index === -1 ? list.push(answer) : list.delete(index);
      });
    case 'SET_USER_ANSWER_FILLBLANK':
      return state.setIn(['questions', action.questionIdx, 'userAnswers', action.answerIdx], action.answer);
    case 'GET_QUIZ_SUCCESS':
      return state.set('isRunning', true)
        .mergeWith((prev, next, key) => key === 'questions' ?
          next.map(question => questionFormat.mergeDeep(question)) : next, action.quiz);
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
      return admin(state, type, action);
  }
}
