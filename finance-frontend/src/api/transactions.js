import api from './axios.js';
 
// API functions for transactions:
// - getAll with query params
// - create, update, delete
// - return response.data
export const getAll = (filters) =>
  api.get('/transactions', { params: filters }).then(r => r.data);
 
export const getOne = (id) =>
  api.get('/transactions/' + id).then(r => r.data);
 
export const create = (data) =>
  api.post('/transactions', data).then(r => r.data);
 
export const update = (id, data) =>
  api.patch('/transactions/' + id, data).then(r => r.data);
 
export const remove = (id) =>
  api.delete('/transactions/' + id).then(r => r.data);
