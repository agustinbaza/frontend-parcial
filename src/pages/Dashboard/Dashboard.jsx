import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './dashboard.css';
import pelisplusLogo from '../../assets/pelisplus.png';
import { getPeliculas, createPelicula, updatePelicula, deletePelicula } from '../../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    // Verificar si el usuario está logueado y es admin
    const usuarioStr = localStorage.getItem('pelisplus_user');
    if (!usuarioStr) {
      navigate('/', { replace: true });
      return;
    }

    const usuario = JSON.parse(usuarioStr);
    if (usuario.usuario !== 'admin') {
      // Si no es admin, redirigir al home
      navigate('/home', { replace: true });
      return;
    }

    const cargarPeliculas = async () => {
      try {
        const pelisBackend = await getPeliculas();
        setPeliculas(pelisBackend);
      } catch (error) {
        console.error('Error al cargar películas:', error);
      }
    };
    
    cargarPeliculas();
  }, [navigate]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [peliculaEditando, setPeliculaEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    director: '',
    anio: '',
    genero: '',
    imagen: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validación de campos
      if (!formData.titulo.trim()) {
        await Swal.fire({
          icon: 'warning',
          title: 'Campo requerido',
          text: 'El título es obligatorio',
          background: '#1a1a1a',
          color: '#ffffff'
        });
        return;
      }

      const peliculaData = {
        titulo: formData.titulo.trim(),
        director: formData.director.trim() || 'Desconocido',
        anio: parseInt(formData.anio) || new Date().getFullYear(),
        genero: formData.genero.trim() || 'Sin clasificar',
        imagen: formData.imagen.trim() || 'https://via.placeholder.com/300x400/6b6b6b/ffffff?text=Sin+Imagen'
      };

      if (peliculaEditando) {
        // Actualizar película existente
        const peliculaActualizada = await updatePelicula(peliculaEditando.id, peliculaData);
        
        setPeliculas(prev => 
          prev.map(p => p.id === peliculaEditando.id ? peliculaActualizada : p)
        );
        
        await Swal.fire({
          icon: 'success',
          title: '¡Película actualizada!',
          text: `"${formData.titulo}" se actualizó exitosamente`,
          timer: 2000,
          showConfirmButton: false,
          background: '#1a1a1a',
          color: '#ffffff'
        });
      } else {
        // Crear nueva película
        // Generar ID único basado en el ID más alto existente
        const maxId = peliculas.length > 0 ? Math.max(...peliculas.map(p => p.id)) : 0;
        const nuevaPeliculaData = { ...peliculaData, id: maxId + 1 };
        
        const nuevaPelicula = await createPelicula(nuevaPeliculaData);
        setPeliculas(prev => [...prev, nuevaPelicula]);
        
        await Swal.fire({
          icon: 'success',
          title: '¡Película agregada!',
          text: `"${formData.titulo}" se agregó exitosamente`,
          timer: 2000,
          showConfirmButton: false,
          background: '#1a1a1a',
          color: '#ffffff'
        });
      }
      
      // Limpiar formulario
      setFormData({
        titulo: '',
        director: '',
        anio: '',
        genero: '',
        imagen: ''
      });
      setMostrarFormulario(false);
      setPeliculaEditando(null);
      
    } catch (error) {
      console.error('Error al guardar película:', error);
      
      let errorMessage = 'No se pudo guardar la película. Intenta nuevamente.';
      if (error.message.includes('ya existe')) {
        errorMessage = 'Ya existe una película con ese ID. Intenta con datos diferentes.';
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: errorMessage,
        background: '#1a1a1a',
        color: '#ffffff'
      });
    }
  };

  const handleEditar = (pelicula) => {
    setPeliculaEditando(pelicula);
    setFormData({
      titulo: pelicula.titulo || '',
      director: pelicula.director || '',
      anio: pelicula.anio || pelicula.año || '',
      genero: pelicula.genero || '',
      imagen: pelicula.imagen || ''
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    const pelicula = peliculas.find(p => p.id === id);
    
    const result = await Swal.fire({
      title: '¿Eliminar película?',
      text: `¿Estás seguro de que quieres eliminar "${pelicula?.titulo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#4a5568',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1a1a1a',
      color: '#ffffff'
    });

    if (result.isConfirmed) {
      try {
        // Eliminar del backend
        await deletePelicula(id);
        
        // Actualizar el estado local solo si la eliminación del backend fue exitosa
        setPeliculas(prev => prev.filter(pelicula => pelicula.id !== id));
        
        await Swal.fire({
          icon: 'success',
          title: 'Película eliminada',
          text: `"${pelicula?.titulo}" fue eliminada exitosamente`,
          timer: 2000,
          showConfirmButton: false,
          background: '#1a1a1a',
          color: '#ffffff'
        });
      } catch (error) {
        console.error('Error al eliminar película:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: 'No se pudo eliminar la película del servidor. Intenta nuevamente.',
          background: '#1a1a1a',
          color: '#ffffff'
        });
      }
    }
  };

  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setPeliculaEditando(null);
    setFormData({
      titulo: '',
      director: '',
      anio: '',
      genero: '',
      imagen: ''
    });
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que quieres cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#4a5568',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      background: '#1a1a1a',
      color: '#ffffff'
    });

    if (result.isConfirmed) {
      localStorage.removeItem('pelisplus_user');
      localStorage.removeItem('pelisplus_remember');
      
      await Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: '¡Hasta luego!',
        timer: 1500,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#ffffff'
      });
      
      navigate('/', { replace: true });
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <img src={pelisplusLogo} alt="Pelisplus" className="header-logo" />
            <h1 className="dashboard-title">Dashboard de Películas</h1>
          </div>
          <div className="header-actions">
            <button onClick={handleBackToHome} className="home-button">
              🏠 Inicio
            </button>
            <button onClick={() => navigate('/favoritos')} className="favorites-button">
              ❤️ Favoritos
            </button>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Actions Bar */}
          <div className="actions-bar">
            <h2 className="section-title">Gestión de Películas</h2>
            <button 
              onClick={() => setMostrarFormulario(true)}
              className="add-button"
            >
              + Agregar Película
            </button>
          </div>

          {/* Movies Grid */}
          <div className="movies-grid">
            {peliculas.map(pelicula => (
              <div key={pelicula.id} className="movie-card">
                <div className="movie-image">
                  <img 
                    src={pelicula.imagen} 
                    alt={pelicula.titulo}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400/6b6b6b/ffffff?text=Sin+Imagen';
                    }}
                  />
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{pelicula.titulo}</h3>
                  <p className="movie-genre">{pelicula.genero || 'Sin clasificar'}</p>
                  <p className="movie-details">{pelicula.anio || pelicula.año || 'N/A'} • {pelicula.director || 'Director desconocido'}</p>
                  <div className="movie-actions">
                    <button 
                      onClick={() => handleEditar(pelicula)}
                      className="edit-button"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleEliminar(pelicula.id)}
                      className="delete-button"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Form */}
          {mostrarFormulario && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 className="modal-title">
                  {peliculaEditando ? 'Editar Película' : 'Agregar Nueva Película'}
                </h3>
                <form onSubmit={handleSubmit} className="movie-form">
                  <div className="form-group">
                    <label>Título *:</label>
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Nombre de la película"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Director:</label>
                    <input
                      type="text"
                      name="director"
                      value={formData.director}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Director de la película"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Año:</label>
                    <input
                      type="number"
                      name="anio"
                      value={formData.anio}
                      onChange={handleInputChange}
                      className="form-input"
                      min="1900"
                      max="2030"
                      placeholder="2024"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Género:</label>
                    <input
                      type="text"
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Drama, Acción, Comedia..."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>URL de Imagen:</label>
                    <input
                      type="url"
                      name="imagen"
                      value={formData.imagen}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={cancelarFormulario} className="cancel-button">
                      Cancelar
                    </button>
                    <button type="submit" className="submit-button">
                      {peliculaEditando ? 'Actualizar' : 'Agregar'} Película
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;