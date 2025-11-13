import { styles } from '../../styles';

const CheckboxQuestion = ({ question, onUpdate }) => {
  const addOption = () => {
    const newOptions = [...question.options, ''];
    onUpdate(question.id, { options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    onUpdate(question.id, { options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    onUpdate(question.id, { options: newOptions });
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      <input
        type="text"
        placeholder="Escribe la pregunta..."
        value={question.question}
        onChange={(e) => onUpdate(question.id, { question: e.target.value })}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '14px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginBottom: '10px'
        }}
      />
      
      <div style={{ marginLeft: '20px' }}>
        {question.options.map((option, index) => (
          <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="checkbox"
              disabled
              style={{ marginTop: '10px' }}
            />
            <input
              type="text"
              placeholder={`Opción ${index + 1}`}
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '13px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            {question.options.length > 1 && (
              <button
                onClick={() => removeOption(index)}
                style={{
                  padding: '8px 12px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addOption}
          style={{
            marginTop: '8px',
            padding: '8px 16px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          + Agregar opción
        </button>
      </div>

      <div style={{ marginTop: '12px' }}>
        <label style={{ fontSize: '12px' }}>
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate(question.id, { required: e.target.checked })}
          />
          {' '}Obligatoria
        </label>
      </div>
    </div>
  );
};

export default CheckboxQuestion;
