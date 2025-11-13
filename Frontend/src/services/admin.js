import api from './api';

export const adminService = {
  listAlumni: () => api.get('/admin/alumni').then(r => r.data),
  approveAlumni: (id) => api.put(`/admin/alumni/approve/${id}`).then(r => r.data),
  updateAlumni: (id, data) => api.put(`/admin/alumni/${id}`, data).then(r => r.data),
  deleteAlumni: (id) => api.delete(`/admin/alumni/${id}`).then(r => r.data),

  listSchools: () => api.get('/admin/schools').then(r => r.data),
  createSchool: (data) => api.post('/admin/schools', data).then(r => r.data),
  updateSchool: (id, data) => api.put(`/admin/schools/${id}`, data).then(r => r.data),
  deleteSchool: (id) => api.delete(`/admin/schools/${id}`).then(r => r.data),
  assignUserToSchool: (payload) => api.post('/admin/schools/assign-user', payload).then(r => r.data),

  globalAnalytics: () => api.get('/admin/analytics/global').then(r => r.data),
  createSurvey: (data) => api.post('/admin/surveys', data).then(r => r.data),

  sendNewsletter: (data) => api.post('/admin/mailing/send', data).then(r => r.data),
};
