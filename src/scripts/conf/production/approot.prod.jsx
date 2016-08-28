import React from 'react';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import router from '../../router';

import state from '../../state';

const reduxRouterMiddleware = routerMiddleware(browserHistory);

const finalCreateStore = applyMiddleware(thunk, reduxRouterMiddleware)(createStore);

function configureStore(initialState) {
  return finalCreateStore(state, initialState);
}

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store);

export default (
  <Provider store={store}>
    {router(history)}
  </Provider>
);
