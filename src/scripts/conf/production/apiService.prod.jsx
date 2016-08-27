import { create } from 'axios';

const api = create();

export function getQuizRequest(name) {
  return api.get('/api/quiz', { params: { name } });
}

export function sendResultsRequest(payload) {
  return api.post('/api/quiz', payload);
}

export function saveQuizRequest(payload) {
  return api.post('/api/admin/quiz', payload);
}

export function getQuizListRequest() {
  return api.get('/api/admin/quiz');
}

export function getQuizByIdRequest(id) {
  return api.get(`/api/admin/quiz/${id}`);
}

export function updateStatusRequest(id, status) {
  return api.patch(`/api/admin/quiz/${id}`, { status });
}
