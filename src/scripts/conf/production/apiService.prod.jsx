import { create } from 'axios';

const api = create();

export function getQuizRequest(name) {
  return api.get('/api/test', { name });
}

export function sendResultsRequest(payload) {
  return api.post('/api/test', payload);
}
