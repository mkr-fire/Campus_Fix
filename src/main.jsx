// ============================================================
// src/main.jsx — Point d'entrée React
// Responsable : M5 (Chef de Projet)
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

// Montage de l'application React dans la div #root de index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
