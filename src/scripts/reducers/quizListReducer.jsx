'use !extensible';
import { fromJS as immutableJS } from 'immutable';
import moment from 'moment';

const quizFormat = immutableJS({
  id: 0,
  title: 'Test',
  createdAt: moment(),
  updatedAt: moment(),
  users: 0,
  status: 'passive',
});

const quizListState = immutableJS([]);

export default function quizList(state = quizListState, { type, ...action }) {
  switch (type) {
    case 'GET_QUIZ_LIST_SUCCESS':
      return immutableJS(action.list.map((quiz) => quizFormat.merge(quiz)));
    case 'GET_QUIZ_LIST_ERROR':
      return state;
    case 'CHANGE_STATUS_SUCCESS':
      return state.map((quiz) => quiz.set('status', 'passive'))
      .setIn([state.findKey((quiz) => quiz.get('id') === action.quiz.id), 'status'], action.status);
    default:
      return state;
  }
}
