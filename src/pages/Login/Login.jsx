import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './login.css';
import pelisplusLogo from '../../assets/pelisplus.png';
import { loginUsuario } from '../../api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: '',
    contraseña: '',
    recordarme: false
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validación básica
      if (!formData.usuario.trim() || !formData.contraseña.trim()) {
        await Swal.fire({
          icon: 'warning',
          title: 'Campos requeridos',
          text: 'Por favor, completa todos los campos',
          background: '#1a1a1a',
          color: '#ffffff'
        });
        return;
      }

      // Intentar login con el backend
      const response = await loginUsuario(formData.usuario, formData.contraseña);
      
      if (response && response.usuario) {
        // Guardar preferencias
        if (formData.recordarme) {
          localStorage.setItem('pelisplus_remember', 'true');
        }
        localStorage.setItem('pelisplus_user', JSON.stringify(response.usuario));
        
        // Mostrar mensaje de bienvenida
        await Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: `Hola ${response.usuario.nombre || response.usuario.usuario}`,
          timer: 1500,
          showConfirmButton: false,
          background: '#1a1a1a',
          color: '#ffffff'
        });
        
        // Determinar redirección basada en el usuario
        if (response.usuario.usuario === 'admin') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/home', { replace: true });
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error de conexión con el servidor';
      let errorTitle = 'Error de conexión';
      
      if (error.message.includes('401') || error.message.includes('Credenciales incorrectas')) {
        errorMessage = 'Usuario o contraseña incorrectos';
        errorTitle = 'Error de acceso';
      } else if (error.message.includes('404')) {
        errorMessage = 'Servicio de autenticación no disponible';
        errorTitle = 'Servicio no disponible';
      } else if (error.message.includes('Error de red')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        errorTitle = 'Error de conexión';
      }
      
      await Swal.fire({
        icon: 'error',
        title: errorTitle,
        text: errorMessage,
        background: '#1a1a1a',
        color: '#ffffff'
      });
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
