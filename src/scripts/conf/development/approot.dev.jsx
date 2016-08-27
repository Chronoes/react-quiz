import React from 'react';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import router from '../../router';
import DevTools from '../../DevTools';

import state from '../../state';

const reduxRouterMiddleware = routerMiddleware(browserHistory);

const finalCreateStore = compose(
  applyMiddleware(thunk, reduxRouterMiddleware),
  DevTools.instrument()
)(createStore);

function configureStore(initialState) {
  const store = finalCreateStore(state, initialState);

  if (module.hot) {
    /* eslint global-require: 0 */
    module.hot.accept('../../state', () => store.replaceReducer(require('../../state').default));
  }

  return store;
}

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store);

export default (
  <Provider store={store}>
    <div>
      {router(history)}
      <DevTools />
    </div>
  </Provider>
);
