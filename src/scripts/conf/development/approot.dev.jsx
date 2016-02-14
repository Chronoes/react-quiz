import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import {browserHistory} from 'react-router';
import {syncHistory} from 'react-router-redux';

import router from '../../router';
import DevTools from '../../DevTools';

import state from '../../state';

const reduxRouterMiddleware = syncHistory(browserHistory);

const finalCreateStore = compose(
  applyMiddleware(thunk, reduxRouterMiddleware),
  DevTools.instrument()
)(createStore);

function configureStore(initialState) {
  const store = finalCreateStore(state, initialState);

  if (module.hot) {
    module.hot.accept('../../state', () => store.replaceReducer(require('../../state')));
  }

  return store;
}

const store = configureStore();
reduxRouterMiddleware.listenForReplays(store);

export default (
  <Provider store={store}>
    <div>
      {router}
      <DevTools />
    </div>
  </Provider>
);
