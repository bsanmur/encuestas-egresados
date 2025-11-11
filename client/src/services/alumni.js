import api from './api';

export const alumniService = {
  getMyProfile: () => api.get('/alumni/profile/me').then(r => r.data),
  updateMyProfile: (data) => api.put('/alumni/profile/me', data).then(r => r.data),
};
