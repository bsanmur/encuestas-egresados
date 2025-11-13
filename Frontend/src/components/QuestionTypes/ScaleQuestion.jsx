import { styles } from '../../styles';

const ScaleQuestion = ({ question, onUpdate }) => {
  const scale = question.scale || { min: 1, max: 5, minLabel: '', maxLabel: '' };

  const updateScale = (field, value) => {
    onUpdate(question.id, {
      scale: { ...scale, [field]: value }
    });
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
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
        <label style={{ fontSize: '13px' }}>
          Desde:
          <input
            type="number"
            value={scale.min}
            onChange={(e) => updateScale('min', parseInt(e.target.value))}
            style={{
              width: '60px',
              marginLeft: '5px',
              padding: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </label>
        <label style={{ fontSize: '13px' }}>
          Hasta:
          <input
            type="number"
            value={scale.max}
            onChange={(e) => updateScale('max', parseInt(e.target.value))}
            style={{
              width: '60px',
              marginLeft: '5px',
              padding: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Etiqueta mínimo (ej: Muy malo)"
          value={scale.minLabel}
          onChange={(e) => updateScale('minLabel', e.target.value)}
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '13px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <input
          type="text"
          placeholder="Etiqueta máximo (ej: Muy bueno)"
          value={scale.maxLabel}
          onChange={(e) => updateScale('maxLabel', e.target.value)}
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '13px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
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

export default ScaleQuestion;
