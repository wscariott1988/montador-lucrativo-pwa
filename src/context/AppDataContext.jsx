import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { computeDepreciacaoMensal } from '../utils/pricing';
import { formatBRL } from '../utils/formatters';
import { addClient, updateClient, deleteClient } from '../services/clientService';

const CACHE_KEYS = {
  profile: 'ml_cache_profile',
  tools: 'ml_cache_tools',
  clients: 'ml_cache_clients',
};

const PRIVACY_KEY = 'ml_modo_privacidade';

function loadPrivacy() {
  try {
    return window.localStorage.getItem(PRIVACY_KEY) === '1';
  } catch {
    return false;
  }
}

function loadCache(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage indisponivel/cheio: segue somente com o cache do Firestore
  }
}

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const online = useOnlineStatus();
  const uid = user?.uid ?? null;

  // Semente instantanea do LocalStorage: a UI carrega quase sem esperar (offline-first)
  const [profile, setProfile] = useState(() =>
    uid ? loadCache(CACHE_KEYS.profile, null) : null
  );
  const [tools, setTools] = useState(() => (uid ? loadCache(CACHE_KEYS.tools, []) : []));
  const [clients, setClients] = useState(() => (uid ? loadCache(CACHE_KEYS.clients, []) : []));
  const [loading, setLoading] = useState(uid != null);
  // Modo privacidade PERMANENTE: persiste ao fechar/reabrir o app (localStorage).
  const [privacidade, setPrivacidade] = useState(loadPrivacy);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setTools([]);
      setClients([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const unsubProfile = onSnapshot(
      doc(db, 'users', uid),
      (snapshot) => {
        if (snapshot.exists()) {
          const next = { uid, ...snapshot.data() };
          setProfile(next);
          saveCache(CACHE_KEYS.profile, next);
        }
      },
      (error) => {
        console.warn('[AppData] watch do perfil interrompido:', error.code || error.message);
      }
    );

    const unsubTools = onSnapshot(
      collection(db, 'users', uid, 'ferramentas'),
      (snapshot) => {
        const list = snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
        setTools(list);
        saveCache(CACHE_KEYS.tools, list);
        setLoading(false);
      },
      (error) => {
        console.warn('[AppData] watch de ferramentas interrompido:', error.code || error.message);
        setLoading(false);
      }
    );

    const unsubClients = onSnapshot(
      query(collection(db, 'users', uid, 'clientes'), orderBy('nome', 'asc')),
      (snapshot) => {
        const list = snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
        setClients(list);
        saveCache(CACHE_KEYS.clients, list);
      },
      (error) => {
        console.warn('[AppData] watch de clientes interrompido:', error.code || error.message);
      }
    );

    return () => {
      unsubProfile();
      unsubTools();
      unsubClients();
    };
  }, [uid]);

  const updateProfile = useCallback(
    async (patch) => {
      if (!uid) return;
      await setDoc(doc(db, 'users', uid), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
    },
    [uid]
  );

  const addTool = useCallback(
    async ({ nome, valorCompra, vidaUtilMeses }) => {
      if (!uid) return;
      const toolsRef = collection(db, 'users', uid, 'ferramentas');
      await addDoc(toolsRef, {
        nome: String(nome ?? '').trim(),
        valorCompra: Number(valorCompra) || 0,
        vidaUtilMeses: Number(vidaUtilMeses) || 0,
        depreciacaoMensal: computeDepreciacaoMensal(valorCompra, vidaUtilMeses),
        createdAt: serverTimestamp(),
      });
    },
    [uid]
  );

  const updateTool = useCallback(
    async (toolId, { nome, valorCompra, vidaUtilMeses }) => {
      if (!uid || !toolId) return;
      const toolRef = doc(db, 'users', uid, 'ferramentas', toolId);
      await setDoc(
        toolRef,
        {
          nome: String(nome ?? '').trim(),
          valorCompra: Number(valorCompra) || 0,
          vidaUtilMeses: Number(vidaUtilMeses) || 0,
          depreciacaoMensal: computeDepreciacaoMensal(valorCompra, vidaUtilMeses),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    },
    [uid]
  );

  const deleteTool = useCallback(
    async (toolId) => {
      if (!uid || !toolId) return;
      await deleteDoc(doc(db, 'users', uid, 'ferramentas', toolId));
    },
    [uid]
  );

  const createClient = useCallback(
    async (data) => {
      if (!uid) return;
      await addClient(uid, data);
    },
    [uid]
  );

  const editClient = useCallback(
    async (clientId, data) => {
      if (!uid || !clientId) return;
      await updateClient(uid, clientId, data);
    },
    [uid]
  );

  const removeClient = useCallback(
    async (clientId) => {
      if (!uid || !clientId) return;
      await deleteClient(uid, clientId);
    },
    [uid]
  );

  const valorHoraCalculado = Number(profile?.valorHoraCalculado ?? 0) || 0;

  const togglePrivacidade = useCallback(() => {
    setPrivacidade((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(PRIVACY_KEY, next ? '1' : '0');
      } catch {
        // Storage indisponivel: segue so em memoria
      }
      return next;
    });
  }, []);

  // Todos os valores financeiros do app passam por aqui: quando o modo
  // privacidade esta ativo, qualquer montante vira "R$ ***" na interface.
  const formatCurrency = useCallback(
    (value) => (privacidade ? 'R$ ***' : formatBRL(value)),
    [privacidade]
  );

  const value = {
    profile,
    tools,
    clients,
    loading,
    online,
    valorHoraCalculado,
    privacidade,
    togglePrivacidade,
    formatCurrency,
    updateProfile,
    addTool,
    updateTool,
    deleteTool,
    createClient,
    editClient,
    removeClient,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData deve ser usado dentro de <AppDataProvider>.');
  }
  return context;
}