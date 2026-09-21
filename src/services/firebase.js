import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore';

// Configuracao carregada via variaveis de ambiente (ver .env.example)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Offline-First: Firestore inicializado COM cache local persistente (IndexedDB).
// O cache local garante leitura instantanea e fila de gravacao quando off-line,
// com sincronizacao automatica ao reconectar. Suporte multi-tab incluido.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    tabManager: persistentMultipleTabManager(),
  }),
});

// Persistencia de sessao no dispositivo (obrigatoria para o fluxo offline)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('[auth] Falha ao persistir sessao local:', error.code || error.message);
});