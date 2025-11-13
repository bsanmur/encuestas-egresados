import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }).then(r => r.data),
  register: (payload) => api.post('/auth/register', payload).then(r => r.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then(r => r.data),
  getSchools: () => api.get('/auth/schools').then(r => r.data),
};
