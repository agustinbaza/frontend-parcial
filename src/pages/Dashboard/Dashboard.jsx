import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import pelisplusLogo from '../../assets/pelisplus.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [peliculas, setPeliculas] = useState([
    {
      id: 1,
      titulo: 'Película de Ejemplo 1',
      genero: 'Acción',
      año: 2023,
      duracion: '120 min',
      imagen: 'https://via.placeholder.com/300x400/e53e3e/ffffff?text=Película+1'
    },
    {
      id: 2,
      titulo: 'Película de Ejemplo 2',
      genero: 'Drama',
      año: 2023,
      duracion: '105 min',
      imagen: 'https://via.placeholder.com/300x400/ff6b35/ffffff?text=Película+2'
    }
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [peliculaEditando, setPeliculaEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    genero: '',
    año: '',
    duracion: '',
    imagen: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (peliculaEditando) {
      // Editar película existente
      setPeliculas(prev => prev.map(pelicula => 
        pelicula.id === peliculaEditando.id 
          ? { ...peliculaEditando, ...formData }
          : pelicula
      ));
      setPeliculaEditando(null);
    } else {
      // Agregar nueva película
      const nuevaPelicula = {
        id: Date.now(),
        ...formData
      };
      setPeliculas(prev => [...prev, nuevaPelicula]);
    }
    
    setFormData({
      titulo: '',
      genero: '',
      año: '',
      duracion: '',
      imagen: ''
    });
    setMostrarFormulario(false);
  };

  const handleEditar = (pelicula) => {
    setPeliculaEditando(pelicula);
    setFormData({
      titulo: pelicula.titulo,
      genero: pelicula.genero,
      año: pelicula.año,
      duracion: pelicula.duracion,
      imagen: pelicula.imagen
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      setPeliculas(prev => prev.filter(pelicula => pelicula.id !== id));
    }
  };

  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setPeliculaEditando(null);
    setFormData({
      titulo: '',
      genero: '',
      año: '',
      duracion: '',
      imagen: ''
    });
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      navigate('/login');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
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
                  <p className="movie-genre">{pelicula.genero}</p>
                  <p className="movie-details">{pelicula.año} • {pelicula.duracion}</p>
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
                    <label>Título:</label>
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Género:</label>
                    <input
                      type="text"
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Año:</label>
                    <input
                      type="number"
                      name="año"
                      value={formData.año}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      min="1900"
                      max="2030"
                    />
                  </div>
                  <div className="form-group">
                    <label>Duración:</label>
                    <input
                      type="text"
                      name="duracion"
                      value={formData.duracion}
                      onChange={handleInputChange}
                      placeholder="ej: 120 min"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>URL de Imagen:</label>
                    <input
                      type="url"
                      name="imagen"
                      value={formData.imagen}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      required
                      className="form-input"
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