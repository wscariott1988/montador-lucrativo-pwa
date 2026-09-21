import { useEffect, useRef } from 'react';
import { useAppData } from '../context/AppDataContext';
import { registrarAcesso, somarTempoUso } from '../services/analyticsService';

const TICK_MS = 60 * 1000;

// Rastreia acesso no login/recarga (uma vez por sessao montada) e acumula
// minutos de uso enquanto o app esta visivel e focado, gravando de forma
// incremental (por pacote) no Firestore. Flexivel a offline: so soma quando
// ha conexao, e descarrega o acumulado ao fechar/minimizar a pagina.
export default function useAnalytics() {
  const { profile, online } = useAppData();
  const uid = profile?.uid ?? null;

  const jaRegistrouAcesso = useRef(false);
  const acumuladoMin = useRef(0);

  // 1) Acesso/sessao (protege contra o double-invoke do StrictMode no dev).
  useEffect(() => {
    if (!uid || jaRegistrouAcesso.current) return;
    jaRegistrouAcesso.current = true;
    registrarAcesso(uid);
  }, [uid]);

  // 2) Timer suave em segundo plano, enquanto o app estiver visivel/focado.
  useEffect(() => {
    if (!uid) return undefined;

    function flush() {
      if (!(acumuladoMin.current > 0) || !navigator.onLine) return;
      const minutos = acumuladoMin.current;
      acumuladoMin.current = 0;
      somarTempoUso(uid, minutos);
    }

    function tick() {
      // Soma apenas com a pagina visivel (foco no app/PWA no navegador).
      if (typeof document !== 'undefined' && !document.hidden) {
        acumuladoMin.current += 1;
      }
      // Descarrega em lotes de 1+ min para reduzir escritas no Firestore.
      flush();
    }

    const timer = setInterval(tick, TICK_MS);

    function flushOnHide() {
      if (typeof document !== 'undefined' && document.hidden) flush();
    }
    function flushOnUnload() {
      flush();
    }

    document.addEventListener('visibilitychange', flushOnHide);
    window.addEventListener('pagehide', flushOnUnload);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', flushOnHide);
      window.removeEventListener('pagehide', flushOnUnload);
      flush();
    };
  }, [uid, online]);
}