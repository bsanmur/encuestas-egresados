import { useState } from 'react'
import SurveyBuilder from './components/SurveyBuilder/SurveyBuilder'
import SurveyList from './components/SurveyList/SurveyList'
import SurveyViewer from './components/SurveyViewer/SurveyViewer'
import { useSurveyStorage } from './hooks/useSurvey'
import { surveyAPI } from './services/api'
import './App.css'

function App() {
  const { surveys, loading, error, saveSurvey, updateSurvey, deleteSurvey, refreshSurveys } = useSurveyStorage();
  const [currentView, setCurrentView] = useState('list');
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const handleCreateNew = () => {
    setCurrentView('create');
    setSelectedSurvey(null);
  };

  const handleSaveSurvey = async (survey) => {
    try {
      if (currentView === 'edit' && selectedSurvey) {
        await updateSurvey(selectedSurvey.id, survey);
        alert('✅ Encuesta actualizada exitosamente');
      } else {
        await saveSurvey(survey);
        alert('✅ Encuesta guardada exitosamente');
      }
      setCurrentView('list');
      setSelectedSurvey(null);
    } catch (err) {
      alert('❌ Error al guardar: ' + err.message);
    }
  };

  const handleSelectSurvey = (survey, mode) => {
    setSelectedSurvey(survey);
    setCurrentView(mode);
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedSurvey(null);
  };

  const handleSubmitResponse = async (answers) => {
    try {
      await surveyAPI.submitResponse(selectedSurvey.id, answers);
      console.log('Respuestas enviadas:', answers);
      alert('✅ ¡Respuestas enviadas exitosamente!');
      setCurrentView('list');
    } catch (err) {
      alert('❌ Error al enviar respuestas: ' + err.message);
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    try {
      await deleteSurvey(surveyId);
      alert('✅ Encuesta eliminada');
    } catch (err) {
      alert('❌ Error al eliminar: ' + err.message);
    }
  };

  if (loading && currentView === 'list') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Cargando encuestas...
      </div>
    );
  }

  if (error && currentView === 'list') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '20px'
      }}>
        <div style={{ color: '#f44336', fontSize: '18px' }}>
          ❌ Error: {error}
        </div>
        <div style={{ color: '#666', fontSize: '14px' }}>
          Asegúrate de que el servidor backend esté corriendo en http://localhost:3000
        </div>
        <button
          onClick={refreshSurveys}
          style={{
            padding: '10px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {currentView === 'list' && (
        <SurveyList
          surveys={surveys}
          onSelectSurvey={handleSelectSurvey}
          onDeleteSurvey={handleDeleteSurvey}
          onCreateNew={handleCreateNew}
        />
      )}
      
      {currentView === 'create' && (
        <SurveyBuilder
          onSave={handleSaveSurvey}
          onCancel={handleBack}
        />
      )}
      
      {currentView === 'edit' && selectedSurvey && (
        <SurveyBuilder
          initialSurvey={selectedSurvey}
          onSave={handleSaveSurvey}
          onCancel={handleBack}
        />
      )}
      
      {currentView === 'view' && selectedSurvey && (
        <SurveyViewer
          survey={selectedSurvey}
          onBack={handleBack}
          onSubmit={handleSubmitResponse}
        />
      )}
    </div>
  )
}

export default App
