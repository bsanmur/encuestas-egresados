import api from './api';

export const schoolService = {
  analytics: () => api.get('/school/dashboard/analytics').then(r => r.data),
};
