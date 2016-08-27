import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './App';
import UserPage from './pages/UserPage';
import QuizPage from './pages/QuizPage';
import AdminPage from './pages/AdminPage';
import AdminQuizPage from './pages/AdminQuizPage';
import QuizListPage from './pages/QuizListPage';

export default (history) => (
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={UserPage} />
      <Route path="quiz" component={QuizPage} />
      <Route path="admin" component={AdminPage}>
        <IndexRoute component={QuizListPage} />
        <Route path="quiz" component={AdminQuizPage} />
      </Route>
    </Route>
  </Router>
);
