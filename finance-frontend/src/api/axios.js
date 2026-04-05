import axios from 'axios';
 
// Axios instance with base URL from env.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});
 
// Request interceptor attaches Bearer token from localStorage.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});
 
// Response interceptor catches 401 and clears auth state then
// redirects to /login - handles expired tokens automatically.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
 
export default api;
