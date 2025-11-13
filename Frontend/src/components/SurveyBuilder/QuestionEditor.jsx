import TextQuestion from '../QuestionTypes/TextQuestion';
import MultipleChoiceQuestion from '../QuestionTypes/MultipleChoiceQuestion';
import CheckboxQuestion from '../QuestionTypes/CheckboxQuestion';
import ScaleQuestion from '../QuestionTypes/ScaleQuestion';

const QuestionEditor = ({ question, onUpdate, onDelete, index }) => {
  const questionTypes = {
    text: 'Texto',
    multipleChoice: 'Opción múltiple',
    checkbox: 'Casillas de verificación',
    scale: 'Escala'
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'text':
        return <TextQuestion question={question} onUpdate={onUpdate} />;
      case 'multipleChoice':
        return <MultipleChoiceQuestion question={question} onUpdate={onUpdate} />;
      case 'checkbox':
        return <CheckboxQuestion question={question} onUpdate={onUpdate} />;
      case 'scale':
        return <ScaleQuestion question={question} onUpdate={onUpdate} />;
      default:
        return <TextQuestion question={question} onUpdate={onUpdate} />;
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '15px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', color: '#666' }}>Pregunta {index + 1}</span>
          <select
            value={question.type}
            onChange={(e) => onUpdate(question.id, { type: e.target.value })}
            style={{
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '13px'
            }}
          >
            {Object.entries(questionTypes).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => onDelete(question.id)}
          style={{
            padding: '6px 12px',
            background: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Eliminar
        </button>
      </div>
      {renderQuestionInput()}
    </div>
  );
};

export default QuestionEditor;
