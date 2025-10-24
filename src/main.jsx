// main.jsx o App.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useMockApi } from './services/mockApiService';

// Inicializar el mock API si está en modo demo
if (import.meta.env.VITE_DEMO_MODE === 'true') {
  useMockApi();
  console.log('🎭 Modo Demo Activado - Usando datos simulados');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);