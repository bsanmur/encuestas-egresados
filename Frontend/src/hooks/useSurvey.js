import { useState, useEffect } from 'react';
import { surveyAPI } from '../services/api';

export const useSurvey = (initialSurvey = null) => {
  const [survey, setSurvey] = useState(
    initialSurvey || {
      title: '',
      description: '',
      questions: []
    }
  );

  useEffect(() => {
    if (initialSurvey) {
      setSurvey(initialSurvey);
    }
  }, [initialSurvey]);

  const addQuestion = (type) => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      type: type,
      question: '',
      required: false,
      options: type === 'multipleChoice' || type === 'checkbox' ? [''] : []
    };

    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (id, updates) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, ...updates } : q
      )
    }));
  };

  const deleteQuestion = (id) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const updateSurveyInfo = (field, value) => {
    setSurvey(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetSurvey = () => {
    setSurvey({
      title: '',
      description: '',
      questions: []
    });
  };

  return {
    survey,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    updateSurveyInfo,
    resetSurvey
  };
};

export const useSurveyStorage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar encuestas del backend
  const loadSurveys = async () => {
    try {
      setLoading(true);
      const data = await surveyAPI.getAllSurveys();
      setSurveys(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando encuestas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const saveSurvey = async (survey) => {
    try {
      const newSurvey = await surveyAPI.createSurvey(survey);
      setSurveys(prev => [...prev, newSurvey]);
      return newSurvey;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSurvey = async (surveyId, survey) => {
    try {
      const updatedSurvey = await surveyAPI.updateSurvey(surveyId, survey);
      setSurveys(prev => prev.map(s => s.id === surveyId ? updatedSurvey : s));
      return updatedSurvey;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSurvey = async (surveyId) => {
    try {
      await surveyAPI.deleteSurvey(surveyId);
      setSurveys(prev => prev.filter(s => s.id !== surveyId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    surveys,
    loading,
    error,
    saveSurvey,
    updateSurvey,
    deleteSurvey,
    refreshSurveys: loadSurveys
  };
};
