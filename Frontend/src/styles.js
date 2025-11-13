// Estilos modernos reutilizables
export const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    minHeight: '100vh'
  },

  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
    transition: 'all 0.3s ease'
  },

  cardHover: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },

  input: {
    width: '100%',
    padding: '14px 18px',
    fontSize: '15px',
    border: '2px solid #e8ecf1',
    borderRadius: '10px',
    backgroundColor: '#f8f9fb',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit'
  },

  textarea: {
    width: '100%',
    padding: '14px 18px',
    fontSize: '15px',
    border: '2px solid #e8ecf1',
    borderRadius: '10px',
    backgroundColor: '#f8f9fb',
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease'
  },

  select: {
    padding: '10px 14px',
    border: '2px solid #e8ecf1',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  button: {
    primary: {
      padding: '12px 28px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
    },
    secondary: {
      padding: '12px 28px',
      background: 'white',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    success: {
      padding: '12px 28px',
      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(17, 153, 142, 0.4)'
    },
    danger: {
      padding: '12px 28px',
      background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(235, 51, 73, 0.4)'
    },
    warning: {
      padding: '12px 28px',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)'
    },
    gray: {
      padding: '12px 28px',
      background: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    }
  },

  badge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    display: 'inline-block'
  },

  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '12px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },

  subtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '32px',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }
};
