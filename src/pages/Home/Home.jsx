import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import pelisplusLogo from '../../assets/pelisplus.png';

const Home = () => {
  const navigate = useNavigate();
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [generoSeleccionado, setGeneroSeleccionado] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState([]);

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

  const generos = ['todos', ...new Set(peliculasEjemplo.map(p => p.genero))];

  useEffect(() => {
    // Cargar favoritos desde localStorage
    const favoritosGuardados = localStorage.getItem('pelisplus_favoritos');
    if (favoritosGuardados) {
      setFavoritos(JSON.parse(favoritosGuardados));
    }
    
    // Simular carga de datos
    setTimeout(() => {
      setPeliculas(peliculasEjemplo);
      setPeliculasFiltradas(peliculasEjemplo);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let peliculasFiltradas = peliculas;

    // Filtrar por búsqueda
    if (busqueda) {
      peliculasFiltradas = peliculasFiltradas.filter(pelicula =>
        pelicula.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        pelicula.genero.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtrar por género
    if (generoSeleccionado !== 'todos') {
      peliculasFiltradas = peliculasFiltradas.filter(pelicula =>
        pelicula.genero === generoSeleccionado
      );
    }

    setPeliculasFiltradas(peliculasFiltradas);
  }, [busqueda, generoSeleccionado, peliculas]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleMovieClick = (pelicula) => {
    // En una app real, aquí navegarías a la página de detalles de la película
    console.log('Ver película:', pelicula.titulo);
  };

  const toggleFavorito = (peliculaId, event) => {
    event.stopPropagation(); // Evitar que se active el click de la card
    
    let nuevosFavoritos;
    if (favoritos.includes(peliculaId)) {
      // Quitar de favoritos
      nuevosFavoritos = favoritos.filter(id => id !== peliculaId);
    } else {
      // Agregar a favoritos
      nuevosFavoritos = [...favoritos, peliculaId];
    }
    
    setFavoritos(nuevosFavoritos);
    localStorage.setItem('pelisplus_favoritos', JSON.stringify(nuevosFavoritos));
  };

  const esFavorito = (peliculaId) => {
    return favoritos.includes(peliculaId);
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
            <button onClick={handleLogin} className="login-nav-button">
              Administrar
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
                        <div className="movie-rating">
                          ⭐ {pelicula.calificacion}
                        </div>
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
                      <span className="movie-year">{pelicula.año}</span>
                      <span className="movie-duration">{pelicula.duracion}</span>
                      <span className="movie-genre">{pelicula.genero}</span>
                    </div>
                    <p className="movie-description">{pelicula.descripcion}</p>
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