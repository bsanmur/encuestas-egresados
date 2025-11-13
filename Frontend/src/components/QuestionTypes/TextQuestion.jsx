const TextQuestion = ({ question, onUpdate }) => {
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
          borderRadius: '4px'
        }}
      />
      <div style={{ marginTop: '8px' }}>
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

export default TextQuestion;
