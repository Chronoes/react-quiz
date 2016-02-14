import {fromJS as immutableJS} from 'immutable';
import moment from 'moment';

const quizFormat = immutableJS({
  id: 0,
  title: 'Test',
  createdAt: moment(),
  updatedAt: moment(),
  users: 0,
  isActive: false,
});

const quizListState = immutableJS([]);

export default function quizList(state = quizListState, {type, ...action}) {
  switch (type) {
    case 'GET_QUIZ_LIST_SUCCESS':
      return immutableJS(action.list.map(quiz => quizFormat.merge(quiz)));
    case 'GET_QUIZ_LIST_ERROR':
      return state;
    default:
      return state;
  }
}
