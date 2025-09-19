// src/api.js
// Utilidades para consumir el backend

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

// Función auxiliar para manejar respuestas HTTP
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error de red' }));
    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
  }
  return response.json();
};

// ======================
// USUARIOS
// ======================

// Obtener todos los usuarios
export async function getUsuarios() {
  try {
    const response = await fetch(`${API_URL}/usuarios`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// Obtener un usuario por ID
export async function getUsuarioById(id) {
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al obtener usuario ${id}:`, error);
    throw error;
  }
}

// Crear un nuevo usuario
export async function createUsuario(data) {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

// Actualizar un usuario
export async function updateUsuario(id, data) {
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al actualizar usuario ${id}:`, error);
    throw error;
  }
}

// Eliminar un usuario
export async function deleteUsuario(id) {
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al eliminar usuario ${id}:`, error);
    throw error;
  }
}

// Login de usuario
export async function loginUsuario(usuario, password) {
  try {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

// ======================
// PELÍCULAS
// ======================

// Obtener todas las películas
export async function getPeliculas() {
  try {
    const response = await fetch(`${API_URL}/peliculas`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener películas:', error);
    throw error;
  }
}

// Obtener una película por ID
export async function getPeliculaById(id) {
  try {
    const response = await fetch(`${API_URL}/peliculas/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al obtener película ${id}:`, error);
    throw error;
  }
}

// Crear una nueva película
export async function createPelicula(data) {
  try {
    const response = await fetch(`${API_URL}/peliculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al crear película:', error);
    throw error;
  }
}

// Actualizar una película
export async function updatePelicula(id, data) {
  try {
    const response = await fetch(`${API_URL}/peliculas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al actualizar película ${id}:`, error);
    throw error;
  }
}

// Eliminar una película
export async function deletePelicula(id) {
  try {
    const response = await fetch(`${API_URL}/peliculas/${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al eliminar película ${id}:`, error);
    throw error;
  }
}

// ======================
// FAVORITOS
// ======================

// Obtener todos los favoritos
export async function getFavoritos() {
  try {
    const response = await fetch(`${API_URL}/favoritos`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    throw error;
  }
}

// Obtener favoritos de un usuario
export async function getFavoritosUsuario(usuarioId) {
  try {
    const response = await fetch(`${API_URL}/favoritos/${usuarioId}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error al obtener favoritos del usuario ${usuarioId}:`, error);
    throw error;
  }
}

// Agregar película a favoritos
export async function addFavorito(usuarioId, peliculaId, fechaAgregado = null) {
  try {
    const data = {
      usuarioId,
      peliculaId,
      fechaAgregado: fechaAgregado || new Date().toISOString()
    };
    const response = await fetch(`${API_URL}/favoritos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    throw error;
  }
}

// Eliminar película de favoritos
export async function removeFavorito(usuarioId, peliculaId) {
  try {
    const response = await fetch(`${API_URL}/favoritos`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId, peliculaId })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    throw error;
  }
}

// Función auxiliar para verificar si una película está en favoritos
export async function isPeliculaFavorita(usuarioId, peliculaId) {
  try {
    const favoritos = await getFavoritosUsuario(usuarioId);
    return favoritos.peliculas && favoritos.peliculas.some(fav => fav.peliculaId === peliculaId);
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    return false;
  }
}
