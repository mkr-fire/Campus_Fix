// ============================================================
// vite.config.js — Configuration Vite pour Campus Fix
// Responsable : M5 (Chef de Projet)
// ============================================================
// Le proxy redirige les appels /api/* vers le backend Express.
// Ainsi, le frontend appelle juste "/api/tickets" sans écrire
// "http://localhost:5000/api/tickets" en dur dans le code.
// ============================================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173, // Port du serveur de développement React

    proxy: {
      // Toute requête commençant par /api est redirigée vers le backend
      '/api': {
        target: 'http://localhost:5000', // URL du serveur Express
        changeOrigin: true,
      },
    },
  },
});
