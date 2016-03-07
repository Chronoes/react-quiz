import {getQuizListRequest} from '../conf/apiService';

export function getQuizList() {
  return (dispatch) => {
    dispatch({type: 'GET_QUIZ_LIST'});
    return getQuizListRequest()
    .then(({data}) => dispatch({type: 'GET_QUIZ_LIST_SUCCESS', list: data}))
    .catch((err) => dispatch({type: 'GET_QUIZ_LIST_ERROR', err}));
  };
}
