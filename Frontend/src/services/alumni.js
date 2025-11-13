import api from "./api"

export const alumniService = {
  getMyProfile: () => api.get("/alumni/profile/me").then((r) => r.data),
  updateMyProfile: (data) => api.put("/alumni/profile/me", data).then((r) => r.data),

  getMySurveys: () => api.get("/alumni/surveys").then((r) => r.data),
  getSurvey: (surveyId) => api.get(`/alumni/surveys/${surveyId}`).then((r) => r.data),
  submitSurvey: (surveyId, responses) =>
    api.post(`/alumni/surveys/${surveyId}/submit`, { responses }).then((r) => r.data),
}
