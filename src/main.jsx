import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { registerSW } from 'virtual:pwa-register';
import './index.css';

// Registra o Service Worker com auto-update: novas versoes baixam em
// background e aplicam na proxima abertura (fluxo offline-first do PWA).
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);