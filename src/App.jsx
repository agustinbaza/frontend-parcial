import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Favoritos from './pages/Favoritos/Favoritos.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta principal - Login */}
          <Route path="/" element={<Login />} />
          
          {/* Ruta del home */}
          <Route path="/home" element={<Home />} />
          
          {/* Ruta del dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Ruta de favoritos */}
          <Route path="/favoritos" element={<Favoritos />} />
          
          {/* Ruta para páginas no encontradas - redirige al login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
