import api from './axios.js';
 
export const getSummary = (filters) =>
  api.get('/dashboard/summary', { params: filters }).then(r => r.data);
