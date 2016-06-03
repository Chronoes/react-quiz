import { getQuizByIdRequest, saveQuizRequest } from '../conf/apiService';

export function getQuizById(id) {
  return (dispatch) => {
    dispatch({ type: 'GET_QUIZ_BY_ID' });
    return getQuizByIdRequest(id)
      .then(({ data }) => dispatch({ type: 'GET_QUIZ_BY_ID_SUCCESS', quiz: data }))
      .catch((err) => dispatch({ type: 'GET_QUIZ_BY_ID_ERROR', err }));
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
  return { type: 'SET_CHOICES', choices: choices.filter(({ value }) => value.length > 0) };
}

export function saveQuiz({ title, questions, timeLimit }) {
  return (dispatch) => {
    dispatch({ type: 'SAVE_QUIZ' });
    const payload = {
      title,
      timeLimit,
      questions: questions.toJS(),
    };
    return saveQuizRequest(payload)
    .then(({ data }) => dispatch({ type: 'SAVE_QUIZ_SUCCESS', quiz: data }))
    .catch(() => dispatch({ type: 'SAVE_QUIZ_ERROR' }));
  };
}
