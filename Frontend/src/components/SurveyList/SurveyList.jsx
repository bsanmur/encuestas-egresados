const SurveyList = ({ surveys, onSelectSurvey, onDeleteSurvey, onCreateNew }) => {
  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333' }}>Mis Encuestas</h1>
        <button
          onClick={onCreateNew}
          style={{
            padding: '12px 24px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          + Nueva Encuesta
        </button>
      </div>

      {surveys.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
            No tienes encuestas guardadas
          </p>
          <button
            onClick={onCreateNew}
            style={{
              padding: '12px 24px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Crear mi primera encuesta
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {surveys.map((survey) => (
            <div
              key={survey.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#333', marginBottom: '8px' }}>
                  {survey.title || 'Encuesta sin título'}
                </h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                  {survey.description || 'Sin descripción'}
                </p>
                <p style={{ color: '#999', fontSize: '12px' }}>
                  {survey.questions.length} pregunta{survey.questions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => onSelectSurvey(survey, 'view')}
                  style={{
                    padding: '10px 20px',
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Probar
                </button>
                <button
                  onClick={() => onSelectSurvey(survey, 'edit')}
                  style={{
                    padding: '10px 20px',
                    background: '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => onDeleteSurvey(survey.id)}
                  style={{
                    padding: '10px 20px',
                    background: '#f44336',
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyList;
