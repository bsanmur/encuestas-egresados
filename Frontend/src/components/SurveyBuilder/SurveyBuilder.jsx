import { useSurvey } from '../../hooks/useSurvey';
import QuestionEditor from './QuestionEditor';
import { styles } from '../../styles';

const SurveyBuilder = ({ initialSurvey = null, onSave, onCancel }) => {
  const {
    survey,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    updateSurveyInfo
  } = useSurvey(initialSurvey);

  const handleSave = () => {
    if (!survey.title.trim()) {
      alert('Por favor ingresa un título para la encuesta');
      return;
    }
    if (survey.questions.length === 0) {
      alert('La encuesta debe tener al menos una pregunta');
      return;
    }
    const hasEmptyQuestions = survey.questions.some(q => !q.question.trim());
    if (hasEmptyQuestions) {
      alert('Por favor completa todas las preguntas');
      return;
    }
    
    onSave(survey);
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '30px' }}>Creador de Encuestas</h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <input
          type="text"
          placeholder="Título de la encuesta"
          value={survey.title}
          onChange={(e) => updateSurveyInfo('title', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '10px'
          }}
        />
        <textarea
          placeholder="Descripción de la encuesta (opcional)"
          value={survey.description}
          onChange={(e) => updateSurveyInfo('description', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '80px',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        {survey.questions.map((question, index) => (
          <QuestionEditor
            key={question.id}
            question={question}
            index={index}
            onUpdate={updateQuestion}
            onDelete={deleteQuestion}
          />
        ))}
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => addQuestion('text')}
          style={{
            padding: '12px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          + Pregunta de texto
        </button>
        <button
          onClick={() => addQuestion('multipleChoice')}
          style={{
            padding: '12px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          + Opción múltiple
        </button>
        <button
          onClick={() => addQuestion('checkbox')}
          style={{
            padding: '12px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          + Casillas
        </button>
        <button
          onClick={() => addQuestion('scale')}
          style={{
            padding: '12px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          + Escala
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '15px 30px',
            background: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Volver al Menú
        </button>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: '15px 30px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {initialSurvey ? 'Actualizar' : 'Guardar'} Encuesta
        </button>
      </div>
    </div>
  );
};

export default SurveyBuilder;
