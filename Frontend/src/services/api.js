const API_URL = 'http://localhost:3000/api';

export const surveyAPI = {
  // Obtener todas las encuestas
  async getAllSurveys() {
    const response = await fetch(`${API_URL}/surveys`);
    if (!response.ok) throw new Error('Error al obtener encuestas');
    return response.json();
  },

  // Obtener una encuesta específica
  async getSurvey(id) {
    const response = await fetch(`${API_URL}/surveys/${id}`);
    if (!response.ok) throw new Error('Error al obtener la encuesta');
    return response.json();
  },

  // Crear nueva encuesta
  async createSurvey(survey) {
    const response = await fetch(`${API_URL}/surveys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(survey),
    });
    if (!response.ok) throw new Error('Error al crear la encuesta');
    return response.json();
  },

  // Actualizar encuesta
  async updateSurvey(id, survey) {
    const response = await fetch(`${API_URL}/surveys/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(survey),
    });
    if (!response.ok) throw new Error('Error al actualizar la encuesta');
    return response.json();
  },

  // Eliminar encuesta
  async deleteSurvey(id) {
    const response = await fetch(`${API_URL}/surveys/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar la encuesta');
    return response.json();
  },

  // Enviar respuesta a encuesta
  async submitResponse(surveyId, answers) {
    const response = await fetch(`${API_URL}/surveys/${surveyId}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });
    if (!response.ok) throw new Error('Error al enviar respuesta');
    return response.json();
  },

  // Obtener respuestas de una encuesta
  async getSurveyResponses(surveyId) {
    const response = await fetch(`${API_URL}/surveys/${surveyId}/responses`);
    if (!response.ok) throw new Error('Error al obtener respuestas');
    return response.json();
  }
};
