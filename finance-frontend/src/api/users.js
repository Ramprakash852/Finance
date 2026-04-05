import api from './axios.js';
 
export const getUsers = () =>
  api.get('/users').then(r => r.data);
 
export const updateUser = (id, data) =>
  api.patch('/users/' + id, data).then(r => r.data);
 
export const deleteUser = (id) =>
  api.delete('/users/' + id).then(r => r.data);
