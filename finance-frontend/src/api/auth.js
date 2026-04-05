import api from './axios.js';
 
// Auth API functions: register, login, getMe.
// All functions return the data field from the response directly.
export const register = (data) =>
  api.post('/auth/register', data).then(r => r.data);
 
export const login = (data) =>
  api.post('/auth/login', data).then(r => r.data);
 
export const getMe = () =>
  api.get('/auth/me').then(r => r.data);
