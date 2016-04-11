import { getQuizRequest, getQuizByIdRequest, sendResultsRequest, saveQuizRequest } from '../conf/apiService';

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

export function getQuizById(id) {
  return (dispatch) => {
    dispatch({ type: 'GET_QUIZ_BY_ID' });
    return getQuizByIdRequest(id)
      .then(({ data }) => dispatch({ type: 'GET_QUIZ_BY_ID_SUCCESS', quiz: data }))
      .catch((err) => dispatch({ type: 'GET_QUIZ_BY_ID_ERROR', err }));
  };
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

export function resetQuizState() {
  return { type: 'RESET_QUIZ_STATE' };
}

export function addQuestion(questionType, title) {
  return { type: 'ADD_QUESTION', questionType, title };
}

export function editQuestion(idx) {
  return { type: 'EDIT_QUESTION', idx };
}

export function moveQuestion(idx, direction) {
  return { type: 'MOVE_QUESTION', idx, direction };
}

export function deleteQuestion(idx) {
  return { type: 'DELETE_QUESTION', idx };
}

export function setTitle(title) {
  return { type: 'SET_TITLE', title };
}

export function setQuestionTitle(title) {
  return { type: 'SET_QUESTION_TITLE', title };
}

export function setChoices(choices) {
  return { type: 'SET_CHOICES', choices: choices.filter(value => value.length > 0) };
}

export function saveQuiz({ title, questions }) {
  return (dispatch) => {
    dispatch({ type: 'SAVE_QUIZ' });
    const payload = {
      title,
      questions: questions.map(
        ({ type, question, choices }) => ({
          type,
          question,
          choices: choices.map(({ value }) => value),
        })).toJS(),
    };
    return saveQuizRequest(payload)
      .then(({ data }) => dispatch({ type: 'SAVE_QUIZ_SUCCESS', quiz: data }))
      .catch(() => dispatch({ type: 'SAVE_QUIZ_ERROR' }));
  };
}
