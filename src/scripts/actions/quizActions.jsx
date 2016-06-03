import { getQuizRequest, sendResultsRequest } from '../conf/apiService';

export function setAnswer(idx, answer) {
  return { type: 'SET_USER_ANSWER', idx, answer };
}

export function setCheckboxAnswer(idx, answer) {
  return { type: 'SET_USER_ANSWER_CHECKBOX', idx, answer };
}

export function setFillblankAnswer(idx, answerIdx, answer) {
  return { type: 'SET_USER_ANSWER_FILLBLANK', idx, answerIdx, answer };
}

export function getQuiz(name) {
  return (dispatch) => getQuizRequest(name)
    .then(({ data }) => dispatch({ type: 'GET_QUIZ_SUCCESS', quiz: data }))
    .catch(({ message }) => dispatch({ type: 'GET_QUIZ_ERROR', message }));
}

export function timeStop(time) {
  return { type: 'TIME_STOP', time };
}

export function finishQuiz() {
  return { type: 'FINISH_QUIZ' };
}

export function sendResults({ userId, timeSpent, questions }) {
  return (dispatch) => {
    dispatch({ type: 'SEND_RESULTS' });
    const payload = {
      userId,
      timeSpent,
      questions: questions.map(
        ({ id, userAnswer, userAnswers }) => ({
          id,
          answer: userAnswers || userAnswer,
        })).toJS(),
    };
    return sendResultsRequest(payload)
      .then(({ data: { correctAnswers } }) => dispatch({ type: 'SEND_RESULTS_SUCCESS', correctAnswers }))
      .catch(() => dispatch({ type: 'SEND_RESULTS_ERROR' }));
  };
}
