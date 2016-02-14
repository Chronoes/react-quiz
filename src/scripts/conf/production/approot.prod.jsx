import React from 'react';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import {browserHistory} from 'react-router';
import {syncHistory} from 'react-router-redux';

import router from '../../router';

import state from '../../state';

const reduxRouterMiddleware = syncHistory(browserHistory);

const finalCreateStore = compose(
  applyMiddleware(thunk, reduxRouterMiddleware)
)(createStore);

function configureStore(initialState) {
  return finalCreateStore(state, initialState);
}

export default (
  <Provider store={configureStore()}>
    {router}
  </Provider>
);
