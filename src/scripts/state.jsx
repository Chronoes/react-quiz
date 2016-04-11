import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';

import quiz from './reducers/quizReducer';
import quizList from './reducers/quizListReducer';

export default combineReducers({
  routing: routeReducer,
  quiz,
  quizList,
});
