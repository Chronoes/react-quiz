import { getQuizListRequest, updateStatusRequest } from '../conf/apiService';

export function changeStatus(quizId, newStatus) {
  return (dispatch) => {
    dispatch({ type: 'CHANGE_STATUS' });
    return updateStatusRequest(quizId, newStatus)
    .then(() => dispatch({ type: 'CHANGE_STATUS_SUCCESS' }))
    .catch(() => dispatch({ type: 'CHANGE_STATUS_ERROR' }));
  };
}

export function getQuizList() {
  return (dispatch) => {
    dispatch({ type: 'GET_QUIZ_LIST' });
    return getQuizListRequest()
    .then(({ data }) => dispatch({ type: 'GET_QUIZ_LIST_SUCCESS', list: data }))
    .catch((err) => dispatch({ type: 'GET_QUIZ_LIST_ERROR', err }));
  };
}
