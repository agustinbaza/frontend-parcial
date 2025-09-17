import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta principal - Home */}
          <Route path="/" element={<Home />} />
          
          {/* Ruta del login */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta del dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Ruta para páginas no encontradas - redirige al home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
