import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './favoritos.css';
import pelisplusLogo from '../../assets/pelisplus.png';
import { getFavoritosUsuario, removeFavorito, getPeliculaById } from '../../api';

const Favoritos = () => {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [peliculasFavoritas, setPeliculasFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Verificar autenticación
    const usuarioStr = localStorage.getItem('pelisplus_user');
    if (!usuarioStr) {
      navigate('/', { replace: true });
      return;
    }

    const usuarioData = JSON.parse(usuarioStr);
    setUsuario(usuarioData);

    const cargarFavoritos = async () => {
      try {
        // Obtener favoritos del usuario
        const favsUsuario = await getFavoritosUsuario(usuarioData.id);
        const listaFavoritos = favsUsuario.peliculas || [];
        setFavoritos(listaFavoritos);

        // Obtener detalles de cada película favorita
        const detallesPeliculas = await Promise.all(
          listaFavoritos.map(async (fav) => {
            try {
              const pelicula = await getPeliculaById(fav.peliculaId);
              return {
                ...pelicula,
                fechaAgregado: fav.fechaAgregado
              };
            } catch (error) {
              console.error(`Error al obtener película ${fav.peliculaId}:`, error);
              return null;
            }
          })
        );

        // Filtrar películas que se obtuvieron correctamente
        const peliculasValidas = detallesPeliculas.filter(p => p !== null);
        setPeliculasFavoritas(peliculasValidas);

      } catch (error) {
        console.error('Error al cargar favoritos:', error);
        if (error.message.includes('404')) {
          // Usuario sin favoritos
          setFavoritos([]);
          setPeliculasFavoritas([]);
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error al cargar favoritos',
            text: 'No se pudieron cargar tus películas favoritas',
            background: '#1a1a1a',
            color: '#ffffff'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    cargarFavoritos();
  }, [navigate]);

  const handleEliminarFavorito = async (peliculaId, titulo) => {
    const result = await Swal.fire({
      title: '¿Eliminar de favoritos?',
      text: `¿Estás seguro de que quieres eliminar "${titulo}" de tus favoritos?`,
      icon: 'question',
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
        await removeFavorito(usuario.id, peliculaId);
        
        // Actualizar estado local
        setFavoritos(prev => prev.filter(fav => fav.peliculaId !== peliculaId));
        setPeliculasFavoritas(prev => prev.filter(p => p.id !== peliculaId));
        
        await Swal.fire({
          icon: 'success',
          title: 'Eliminado de favoritos',
          text: `"${titulo}" se eliminó de tus favoritos`,
          timer: 2000,
          showConfirmButton: false,
          background: '#1a1a1a',
          color: '#ffffff'
        });
      } catch (error) {
        console.error('Error al eliminar favorito:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar de favoritos. Intenta nuevamente.',
          background: '#1a1a1a',
          color: '#ffffff'
        });
      }
    }
  };

  const handleVerPelicula = (pelicula) => {
    // En una app real, aquí navegarías a la página de detalles
    console.log('Ver película:', pelicula.titulo);
  };

  const handleVolver = () => {
    navigate('/home');
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

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha desconocida';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha desconocida';
    }
  };

  if (loading) {
    return (
      <div className="favoritos-loading">
        <div className="loading-spinner">
          <img src={pelisplusLogo} alt="Pelisplus" className="loading-logo" />
          <div className="loading-text">Cargando favoritos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="favoritos-container">
      {/* Header */}
      <header className="favoritos-header">
        <div className="header-content">
          <div className="logo-section">
            <img src={pelisplusLogo} alt="Pelisplus" className="header-logo" />
            <h1 className="favoritos-title">Mis Películas Favoritas</h1>
          </div>
          <nav className="header-nav">
            <button onClick={handleVolver} className="back-button">
              🏠 Volver al Inicio
            </button>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="favoritos-main">
        <div className="favoritos-content">
          {/* Hero Section */}
          <section className="favoritos-hero">
            <h2>Mis Películas Favoritas</h2>
            <p>Tu colección personal de las mejores películas</p>
          </section>

          {/* Stats Section */}
          <div className="favoritos-stats">
            <div className="stats-card">
              <div className="stats-number">{peliculasFavoritas.length}</div>
              <div className="stats-label">Película{peliculasFavoritas.length !== 1 ? 's' : ''} Favorita{peliculasFavoritas.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="stats-info">
              <p>Aquí tienes todas las películas que has marcado como favoritas. Cada una representa una experiencia cinematográfica especial que decidiste guardar.</p>
            </div>
          </div>

          {/* Movies Section */}
          {peliculasFavoritas.length === 0 ? (
            <div className="no-favoritos">
              <div className="no-favoritos-icon">❤️</div>
              <h3>No tienes películas favoritas</h3>
              <p>¡Explora nuestro catálogo y marca tus películas favoritas!</p>
              <button onClick={handleVolver} className="explore-button">
                Explorar Películas
              </button>
            </div>
          ) : (
            <div className="favoritos-grid">
              {peliculasFavoritas.map(pelicula => (
                <div key={pelicula.id} className="favorito-card">
                  <div className="favorito-poster">
                    <img 
                      src={pelicula.imagen} 
                      alt={pelicula.titulo}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500x750/6b6b6b/ffffff?text=Sin+Imagen';
                      }}
                    />
                    <div className="favorito-overlay">
                      <button 
                        className="remove-favorite-button"
                        onClick={() => handleEliminarFavorito(pelicula.id, pelicula.titulo)}
                        title="Eliminar de favoritos"
                      >
                        💔 Eliminar
                      </button>
                      <button 
                        className="watch-button"
                        onClick={() => handleVerPelicula(pelicula)}
                      >
                        ▶ Ver ahora
                      </button>
                    </div>
                  </div>
                  <div className="favorito-info">
                    <h4 className="favorito-title">{pelicula.titulo}</h4>
                    <div className="favorito-meta">
                      <span className="favorito-year">{pelicula.anio || pelicula.año || 'N/A'}</span>
                      <span className="favorito-genre">{pelicula.genero || 'Sin clasificar'}</span>
                    </div>
                    {pelicula.director && (
                      <p className="favorito-director">Dir: {pelicula.director}</p>
                    )}
                    <div className="favorito-date">
                      <small>Agregado el {formatearFecha(pelicula.fechaAgregado)}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Favoritos;