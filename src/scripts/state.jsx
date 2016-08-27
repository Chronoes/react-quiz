import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import quiz from './reducers/quizReducer';
import admin from './reducers/adminReducer';

export default combineReducers({
  routing: routerReducer,
  quiz,
  admin,
});
