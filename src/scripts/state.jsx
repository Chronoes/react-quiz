import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';

import quiz from './reducers/quizReducer';
import admin from './reducers/adminReducer';

export default combineReducers({
  routing: routeReducer,
  quiz,
  admin,
});
