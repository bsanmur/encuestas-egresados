import { useState } from 'react';

const SurveyViewer = ({ survey, onBack, onSubmit }) => {
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckboxChange = (questionId, option, checked) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...currentAnswers, option] };
      } else {
        return { ...prev, [questionId]: currentAnswers.filter(a => a !== option) };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar preguntas obligatorias
    const unanswered = survey.questions.filter(q => {
      if (!q.required) return false;
      const answer = answers[q.id];
      return !answer || (Array.isArray(answer) && answer.length === 0);
    });

    if (unanswered.length > 0) {
      alert(`Por favor responde todas las preguntas obligatorias`);
      return;
    }

    onSubmit(answers);
  };

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            placeholder="Tu respuesta..."
          />
        );

      case 'multipleChoice':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {question.options.map((option, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {question.options.map((option, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={(answers[question.id] || []).includes(option)}
                  onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'scale':
        const scale = question.scale || { min: 1, max: 5, minLabel: '', maxLabel: '' };
        const scaleValues = Array.from(
          { length: scale.max - scale.min + 1 },
          (_, i) => scale.min + i
        );
        
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              {scale.minLabel && <span style={{ fontSize: '12px', color: '#666' }}>{scale.minLabel}</span>}
              {scale.maxLabel && <span style={{ fontSize: '12px', color: '#666' }}>{scale.maxLabel}</span>}
            </div>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              {scaleValues.map(value => (
                <label key={value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={question.id}
                    value={value}
                    checked={answers[question.id] == value}
                    onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                  />
                  <span style={{ marginTop: '5px', fontWeight: 'bold' }}>{value}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <button
        onClick={onBack}
        style={{
          padding: '8px 16px',
          background: '#666',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        ← Volver
      </button>

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>{survey.title}</h1>
        {survey.description && (
          <p style={{ color: '#666', marginBottom: '30px' }}>{survey.description}</p>
        )}

        <form onSubmit={handleSubmit}>
          {survey.questions.map((question, index) => (
            <div key={question.id} style={{
              marginBottom: '30px',
              paddingBottom: '30px',
              borderBottom: index < survey.questions.length - 1 ? '1px solid #eee' : 'none'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                  {index + 1}. {question.question}
                  {question.required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                </span>
              </div>
              {renderQuestion(question, index)}
            </div>
          ))}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '20px'
            }}
          >
            Enviar Respuestas
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurveyViewer;
