import {getQuizRequest, sendResultsRequest} from '../conf/apiService';

export function setAnswer(questionIdx, answer) {
  return {type: 'SET_USER_ANSWER', questionIdx, answer};
}

export function setMultiAnswer(questionIdx, answer, answerIdx) {
  return {type: 'SET_USER_MULTI_ANSWER', questionIdx, answer, answerIdx};
}

export function getQuiz(name) {
  return dispatch => getQuizRequest(name)
    .then(({data}) => dispatch({type: 'GET_QUIZ_SUCCESS', quiz: data}))
    .catch(({message}) => dispatch({type: 'GET_QUIZ_ERROR', message}));
}

export function timeStop(time) {
  return {type: 'TIME_STOP', time};
}

export function finishQuiz() {
  return {type: 'FINISH_QUIZ'};
}

export function sendResults({userId, timeSpent, questions}) {
  return dispatch => {
    dispatch({type: 'SEND_RESULTS'});
    const payload = {
      userId,
      timeSpent,
      questions: questions
        .map(q => {
          return {
            id: q.get('id'),
            answers: q.get('userAnswers'),
          };
        }).toJS(),
    };
    return sendResultsRequest(payload)
      .then(({data: {correctAnswers}}) => dispatch({type: 'SEND_RESULTS_SUCCESS', correctAnswers}))
      .catch(() => dispatch({type: 'SEND_RESULTS_ERROR'}));
  };
}

export function resetQuizState() {
  return {type: 'RESET_QUIZ_STATE'};
}

export function addQuestion(questionType) {
  return {type: 'ADD_QUESTION', questionType};
}

export function deleteQuestion(idx) {
  return {type: 'DELETE_QUESTION', idx};
}

export function setTitle(title) {
  return {type: 'SET_TITLE', title};
}
