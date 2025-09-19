import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './home.css';
import pelisplusLogo from '../../assets/pelisplus.png';
import { getPeliculas, getFavoritosUsuario, addFavorito, removeFavorito, isPeliculaFavorita } from '../../api';

const Home = () => {
  const navigate = useNavigate();
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [generoSeleccionado, setGeneroSeleccionado] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // Datos de películas de ejemplo
  const peliculasEjemplo = [
    {
      id: 1,
      titulo: 'Spider-Man: No Way Home',
      genero: 'Acción',
      año: 2021,
      duracion: '148 min',
      calificacion: 8.4,
      imagen: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
      descripcion: 'Peter Parker busca la ayuda del Doctor Strange para hacer que el mundo olvide que él es Spider-Man.'
    },
    {
      id: 2,
      titulo: 'Top Gun: Maverick',
      genero: 'Acción',
      año: 2022,
      duracion: '130 min',
      calificacion: 8.3,
      imagen: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
      descripcion: 'Después de más de 30 años de servicio, Pete "Maverick" Mitchell sigue siendo un piloto de pruebas.'
    },
    {
      id: 3,
      titulo: 'The Batman',
      genero: 'Acción',
      año: 2022,
      duracion: '176 min',
      calificacion: 7.8,
      imagen: 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
      descripcion: 'Batman desentraña una red de corrupción que conecta a su familia mientras persigue al Riddler.'
    },
    {
      id: 4,
      titulo: 'Dune',
      genero: 'Ciencia Ficción',
      año: 2021,
      duracion: '155 min',
      calificacion: 8.0,
      imagen: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
      descripcion: 'Paul Atreides llega al planeta desértico Arrakis para proteger el recurso más valioso del universo.'
    },
    {
      id: 5,
      titulo: 'Interstellar',
      genero: 'Ciencia Ficción',
      año: 2014,
      duracion: '169 min',
      calificacion: 8.6,
      imagen: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      descripcion: 'Un grupo de exploradores utiliza un agujero de gusano para viajar a través del espacio y el tiempo.'
    },
    {
      id: 6,
      titulo: 'The Godfather',
      genero: 'Drama',
      año: 1972,
      duracion: '175 min',
      calificacion: 9.2,
      imagen: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      descripcion: 'El patriarca de una dinastía del crimen organizado transfiere el control a su hijo reacio.'
    },
    {
      id: 7,
      titulo: 'Pulp Fiction',
      genero: 'Drama',
      año: 1994,
      duracion: '154 min',
      calificacion: 8.9,
      imagen: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      descripcion: 'Las vidas de dos sicarios, un boxeador y otros criminales se entrelazan en Los Ángeles.'
    },
    {
      id: 8,
      titulo: 'Inception',
      genero: 'Ciencia Ficción',
      año: 2010,
      duracion: '148 min',
      calificacion: 8.8,
      imagen: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      descripcion: 'Un ladrón que roba secretos corporativos debe realizar la tarea imposible: la incepción.'
    }
  ];

  const generos = ['todos', ...new Set(peliculas.map(p => p.genero).filter(Boolean))];

  useEffect(() => {
    // Verificar autenticación
    const usuarioStr = localStorage.getItem('pelisplus_user');
    if (!usuarioStr) {
      navigate('/', { replace: true });
      return;
    }

    const usuarioData = JSON.parse(usuarioStr);
    setUsuario(usuarioData);
    setIsAdmin(usuarioData.usuario === 'admin');

    const cargarDatos = async () => {
      try {
        // Cargar películas del backend
        const pelisBackend = await getPeliculas();
        setPeliculas(pelisBackend);
        setPeliculasFiltradas(pelisBackend);

        // Cargar favoritos del usuario
        try {
          const favsUsuario = await getFavoritosUsuario(usuarioData.id);
          setFavoritos(favsUsuario.peliculas || []);
        } catch (favError) {
          console.log('Usuario sin favoritos o error al cargar favoritos');
          setFavoritos([]);
        }
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
        // Mostrar error pero continuar con datos de ejemplo
        await Swal.fire({
          icon: 'warning',
          title: 'Error al cargar datos',
          text: 'No se pudieron cargar las películas del servidor. Mostrando contenido de ejemplo.',
          background: '#1a1a1a',
          color: '#ffffff'
        });
        
        setPeliculas(peliculasEjemplo);
        setPeliculasFiltradas(peliculasEjemplo);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [navigate]);

  useEffect(() => {
    let peliculasFiltradas = peliculas;

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      peliculasFiltradas = peliculasFiltradas.filter(pelicula => {
        const titulo = pelicula.titulo?.toLowerCase() || '';
        const genero = pelicula.genero?.toLowerCase() || '';
        const director = pelicula.director?.toLowerCase() || '';
        const busquedaLower = busqueda.toLowerCase();
        
        return titulo.includes(busquedaLower) || 
               genero.includes(busquedaLower) ||
               director.includes(busquedaLower);
      });
    }

    // Filtrar por género
    if (generoSeleccionado !== 'todos') {
      peliculasFiltradas = peliculasFiltradas.filter(pelicula =>
        pelicula.genero === generoSeleccionado
      );
    }

    setPeliculasFiltradas(peliculasFiltradas);
  }, [busqueda, generoSeleccionado, peliculas]);

  const handleAdministrar = () => {
    const usuarioStr = localStorage.getItem('pelisplus_user');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      if (usuario.usuario === 'admin') {
        navigate('/dashboard');
      }
    } else {
      navigate('/');
    }
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

  const handleMovieClick = (pelicula) => {
    // En una app real, aquí navegarías a la página de detalles de la película
    console.log('Ver película:', pelicula.titulo);
  };

  const toggleFavorito = async (peliculaId, event) => {
    event.stopPropagation(); // Evitar que se active el click de la card
    
    try {
      if (!usuario) {
        await Swal.fire({
          icon: 'warning',
          title: 'Inicia sesión',
          text: 'Debes iniciar sesión para gestionar favoritos',
          background: '#1a1a1a',
          color: '#ffffff'
        });
        return;
      }

      // Verificar si ya es favorito
      const yaEsFavorito = favoritos.some(fav => fav.peliculaId === peliculaId);
      
      if (!yaEsFavorito) {
        // Agregar a favoritos
        await addFavorito(usuario.id, peliculaId);
        
        // Actualizar estado local
        const nuevoFavorito = { 
          peliculaId, 
          usuarioId: usuario.id, 
          fechaAgregado: new Date().toISOString() 
        };
        setFavoritos(prev => [...prev, nuevoFavorito]);
        
        // Obtener el nombre de la película
        const pelicula = peliculas.find(p => p.id === peliculaId);
        
        await Swal.fire({
          icon: 'success',
          title: '¡Agregado a favoritos!',
          text: `"${pelicula?.titulo}" se agregó a tus favoritos`,
          timer: 2000,
          showConfirmButton: false,
          background: '#1a1a1a',
          color: '#ffffff'
        });
      } else {
        // Remover de favoritos
        await removeFavorito(usuario.id, peliculaId);
        
        // Actualizar estado local
        setFavoritos(prev => prev.filter(fav => fav.peliculaId !== peliculaId));
        
        // Obtener el nombre de la película
        const pelicula = peliculas.find(p => p.id === peliculaId);
        
        await Swal.fire({
          icon: 'success',
          title: 'Eliminado de favoritos',
          text: `"${pelicula?.titulo}" se eliminó de tus favoritos`,
          timer: 2000,
          showConfirmButton: false,
          background: '#1a1a1a',
          color: '#ffffff'
        });
      }
    } catch (error) {
      console.error('Error al gestionar favorito:', error);
      
      let errorMessage = 'No se pudo actualizar favoritos. Intenta nuevamente.';
      if (error.message.includes('ya está en favoritos')) {
        errorMessage = 'Esta película ya está en tus favoritos';
      } else if (error.message.includes('no encontrado')) {
        errorMessage = 'No se encontró el favorito para eliminar';
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        background: '#1a1a1a',
        color: '#ffffff'
      });
    }
  };

  const esFavorito = (peliculaId) => {
    if (!usuario) return false;
    return favoritos.some(fav => fav.peliculaId === peliculaId);
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner">
          <img src={pelisplusLogo} alt="Pelisplus" className="loading-logo" />
          <div className="loading-text">Cargando películas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo-section">
            <img src={pelisplusLogo} alt="Pelisplus" className="header-logo" />
            <h1 className="home-title">Pelisplus</h1>
          </div>
          <nav className="header-nav">
            <button onClick={() => navigate('/favoritos')} className="favorites-nav-button">
              ❤️ Mis Favoritos
            </button>
            {isAdmin && (
              <button onClick={handleAdministrar} className="login-nav-button">
                Administrar
              </button>
            )}
            <button onClick={handleLogout} className="logout-nav-button">
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Descubre las mejores películas</h2>
          <p className="hero-subtitle">
            Explora nuestra colección de películas cuidadosamente seleccionadas
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="filters-content">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar películas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">🔍</div>
          </div>
          
          <div className="genre-filter">
            <label className="filter-label">Género:</label>
            <select
              value={generoSeleccionado}
              onChange={(e) => setGeneroSeleccionado(e.target.value)}
              className="genre-select"
            >
              {generos.map(genero => (
                <option key={genero} value={genero}>
                  {genero === 'todos' ? 'Todos los géneros' : genero}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <main className="movies-section">
        <div className="movies-content">
          <div className="section-header">
            <h3 className="section-title">
              {peliculasFiltradas.length} película{peliculasFiltradas.length !== 1 ? 's' : ''} 
              {busqueda && ` encontrada${peliculasFiltradas.length !== 1 ? 's' : ''} para "${busqueda}"`}
              {generoSeleccionado !== 'todos' && ` en ${generoSeleccionado}`}
            </h3>
          </div>

          {peliculasFiltradas.length === 0 ? (
            <div className="no-movies">
              <div className="no-movies-icon">🎬</div>
              <h4>No se encontraron películas</h4>
              <p>Intenta con otros términos de búsqueda o selecciona otro género</p>
            </div>
          ) : (
            <div className="movies-grid">
              {peliculasFiltradas.map(pelicula => (
                <div 
                  key={pelicula.id} 
                  className="movie-card"
                  onClick={() => handleMovieClick(pelicula)}
                >
                  <div className="movie-poster">
                    <img 
                      src={pelicula.imagen} 
                      alt={pelicula.titulo}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500x750/6b6b6b/ffffff?text=Sin+Imagen';
                      }}
                    />
                    <div className="movie-overlay">
                      <div className="movie-top-actions">
                        {pelicula.calificacion && (
                          <div className="movie-rating">
                            ⭐ {pelicula.calificacion}
                          </div>
                        )}
                        <button 
                          className={`favorite-button ${esFavorito(pelicula.id) ? 'favorited' : ''}`}
                          onClick={(e) => toggleFavorito(pelicula.id, e)}
                          title={esFavorito(pelicula.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                          {esFavorito(pelicula.id) ? '❤️' : '🤍'}
                        </button>
                      </div>
                      <button className="play-button">
                        ▶ Ver ahora
                      </button>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h4 className="movie-title">{pelicula.titulo}</h4>
                    <div className="movie-meta">
                      <span className="movie-year">{pelicula.anio || pelicula.año || 'N/A'}</span>
                      {pelicula.duracion && <span className="movie-duration">{pelicula.duracion}</span>}
                      <span className="movie-genre">{pelicula.genero || 'Sin clasificar'}</span>
                    </div>
                    {pelicula.director && (
                      <p className="movie-director">Dirigida por: {pelicula.director}</p>
                    )}
                    {pelicula.descripcion && (
                      <p className="movie-description">{pelicula.descripcion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={pelisplusLogo} alt="Pelisplus" className="footer-logo-img" />
            <span className="footer-brand">Pelisplus</span>
          </div>
          <p className="footer-text">
            Tu plataforma favorita para descubrir y disfrutar las mejores películas.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;