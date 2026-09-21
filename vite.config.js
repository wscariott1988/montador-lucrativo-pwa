import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Sistema Montador Lucrativo',
        short_name: 'Montador',
        description: 'Aplicativo de orçamentos e gestão para montadores de móveis',
        theme_color: '#121212',
        background_color: '#121212',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        // Ignora pare/rodadas a origens externas (auth e realtime) para nao
        // interferir no login/Firestore. Requisicoes cross-origin passam direto.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(firestore|identitytoolkit|securetoken)\.googleapis\.[^/]*/i,
            handler: 'NetworkOnly',
            method: 'GET',
          },
        ],
        // Navegacao SPAs + precache apenas de assets locais (offline-first)
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,svg,png,ico,html,woff2,ttf}'],
        maximumFileSizeToCacheInBytes: 24 * 1024 * 1024,
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('jspdf')) return 'pdf';
          return 'vendor';
        },
      },
    },
  },
});