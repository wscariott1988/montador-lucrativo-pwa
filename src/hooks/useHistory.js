import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchOrcamentosPage,
  setOrcamentoStatus,
  softDeleteOrcamento,
} from '../services/historyService';

// Historia paginada do Historico: carrega a primeira pagina ao montar e
// suporta "Carregar Mais" via cursor (startAfter do ultimo snapshot).
export default function useHistory(uid) {
  const [items, setItems] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const lastDocRef = useRef(null);
  const uidRef = useRef(uid);
  uidRef.current = uid;

  const loadFirstPage = useCallback(async () => {
    if (!uidRef.current) return;
    setInitialLoading(true);
    setPageLoading(false);
    try {
      const { items: page, lastDoc, hasMore: nextHasMore } = await fetchOrcamentosPage(uidRef.current);
      lastDocRef.current = lastDoc;
      setItems(page);
      setHasMore(nextHasMore);
    } catch (error) {
      console.warn('[useHistory] falha ao buscar primeira pagina:', error.code || error.message);
      setItems([]);
      setHasMore(false);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    setItems([]);
    lastDocRef.current = null;
    if (!uid) {
      setInitialLoading(false);
      setHasMore(false);
      return;
    }
    loadFirstPage();
  }, [uid, loadFirstPage]);

  const fetchNextPage = useCallback(async () => {
    if (!uidRef.current || pageLoading || !lastDocRef.current) return;
    setPageLoading(true);
    try {
      const { items: nextItems, lastDoc, hasMore: nextHasMore } = await fetchOrcamentosPage(
        uidRef.current,
        { fromSnapshot: lastDocRef.current }
      );
      lastDocRef.current = lastDoc;
      setItems((prev) => [...prev, ...nextItems]);
      setHasMore(nextHasMore);
    } catch (error) {
      console.warn('[useHistory] falha ao carregar mais:', error.code || error.message);
    } finally {
      setPageLoading(false);
    }
  }, [pageLoading]);

  // Reflecte a atualizacao de status no estado local sem recarregar a lista.
  const toggleStatus = useCallback(
    async (orcamentoId) => {
      if (!uidRef.current) return false;
      let nextStatus = null;
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== orcamentoId) return item;
          nextStatus = item.status === 'pago' ? 'pendente' : 'pago';
          return { ...item, status: nextStatus };
        })
      );
      try {
        await setOrcamentoStatus(uidRef.current, orcamentoId, nextStatus);
        return true;
      } catch (error) {
        console.warn('[useHistory] falha ao trocar status:', error.code || error.message);
        // Reverte a mudanca local em caso de erro
        setItems((prev) =>
          prev.map((item) =>
            item.id === orcamentoId ? { ...item, status: item.status === 'pago' ? 'pendente' : 'pago' } : item
          )
        );
        return false;
      }
    },
    []
  );

  const removeOrcamento = useCallback(async (orcamentoId) => {
    if (!uidRef.current) return false;
    try {
      await softDeleteOrcamento(uidRef.current, orcamentoId);
      setItems((prev) => prev.filter((item) => item.id !== orcamentoId));
      return true;
    } catch (error) {
      console.warn('[useHistory] falha ao excluir orcamento:', error.code || error.message);
      return false;
    }
  }, []);

  return {
    items,
    initialLoading,
    pageLoading,
    hasMore,
    toggleStatus,
    removeOrcamento,
    fetchNextPage,
    reload: loadFirstPage,
  };
}