'use !extensible';
import { fromJS as immutableJS, Map } from 'immutable';
import { combineReducers } from 'redux';

import quizList from './quizListReducer';

export const choiceFormat = new Map({ id: 0, value: '', isAnswer: null });

export const questionFormat = immutableJS({
  id: 0,
  type: 'radio',
  question: '',
  choices: [],
});

const quizState = immutableJS({
  id: 0,
  title: 'Test',
  timeLimit: 0,
  questions: [],
  editingQuestion: 0,
});

function quiz(state = quizState, type, action) {
  switch (type) {
    case 'GET_QUIZ_BY_ID_SUCCESS':
      return state.mergeWith((prev, next, key) => key === 'questions' ?
         next.map((question) => questionFormat.mergeDeep(question)) : next, action.quiz);
    case 'SET_TITLE':
      return state.set('title', action.title);
    case 'ADD_QUESTION':
      return state.set('editingQuestion', state.get('questions').size)
        .update('questions', (questions) => questions.push(
            questionFormat.set('type', action.questionType).set('question', action.title))
        );
    case 'SET_QUESTION_TITLE':
      return state.setIn(['questions', state.get('editingQuestion'), 'question'], action.title);
    case 'SET_CHOICES':
      return state.mergeDeepIn(['questions', state.get('editingQuestion'), 'choices'], action.choices);
    case 'EDIT_QUESTION':
      return state.set('editingQuestion', action.idx);
    case 'MOVE_QUESTION':
      return state.update('questions', (questions) => questions.delete(action.idx)
        .insert(action.direction === 'up' ? action.idx - 1 : action.idx + 1, questions.get(action.idx))
      );
    case 'DELETE_QUESTION':
      return state.deleteIn(['questions', action.idx])
      .update('editingQuestion', (value) => action.idx === state.get('questions').size - 1 ? value - 1 : value);
    case 'SAVE_QUIZ_SUCCESS':
      return state.mergeDeep(action.quiz);
    case 'RESET_QUIZ_STATE':
      return quizState;
    default:
      return state;
  }
}

export default combineReducers({
  quiz,
  quizList,
});
