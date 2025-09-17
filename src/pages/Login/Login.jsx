import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import pelisplusLogo from '../../assets/pelisplus.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: '',
    contraseña: '',
    recordarme: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulación de autenticación
      // Aquí puedes agregar la lógica real de autenticación
      console.log('Datos del formulario:', formData);
      
      // Simulamos un delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validación básica (puedes cambiar estos valores)
      if (formData.usuario === 'admin' && formData.contraseña === 'admin') {
        // Login exitoso
        if (formData.recordarme) {
          localStorage.setItem('pelisplus_remember', 'true');
          localStorage.setItem('pelisplus_user', formData.usuario);
        }
        
        // Navegar al dashboard
        navigate('/dashboard', { replace: true });
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo">
            <img src={pelisplusLogo} alt="Pelisplus Logo" className="logo-image" />
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="input-group">
            <input
              type="text"
              name="usuario"
              placeholder="Ingrese el usuario..."
              value={formData.usuario}
              onChange={handleInputChange}
              className="input-field"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="contraseña"
              placeholder="Ingrese la contraseña..."
              value={formData.contraseña}
              onChange={handleInputChange}
              className="input-field"
              required
              disabled={loading}
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="recordarme"
                checked={formData.recordarme}
                onChange={handleInputChange}
                className="checkbox-input"
                disabled={loading}
              />
              <span className="checkmark"></span>
              Recordarme
            </label>
          </div>

          <div className="login-hint">
            <p>Usar: admin / admin para acceder</p>
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'INGRESANDO...' : 'INGRESAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
