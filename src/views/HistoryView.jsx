import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, FilePlus2, RefreshCw, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import useHistory from '../hooks/useHistory';
import HistoryCard from '../components/history/HistoryCard';
import HistorySkeleton from '../components/history/HistorySkeleton';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

export default function HistoryView() {
  const { user } = useAuth();
  const { clients } = useAppData();
  const navigate = useNavigate();

  const { items, initialLoading, pageLoading, hasMore, toggleStatus, removeOrcamento, fetchNextPage } =
    useHistory(user?.uid ?? null);

  const [isSubmittingId, setIsSubmittingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  async function handleToggleStatus(orcamento) {
    if (isSubmittingId) return;
    setIsSubmittingId(orcamento.id);
    try {
      const ok = await toggleStatus(orcamento.id);
      if (ok) {
        const novo = orcamento.status === 'pago' ? 'Pendente' : 'Pago';
        setToast({
          tone: 'success',
          message: `Orçamento marcado como ${novo}.`,
        });
      } else {
        setToast({ tone: 'error', message: 'Não foi possível alterar o status. Tente novamente.' });
      }
    } finally {
      setIsSubmittingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const ok = await removeOrcamento(deleteTarget.id);
      setToast(
        ok
          ? { tone: 'success', message: 'Orçamento excluído do histórico.' }
          : { tone: 'error', message: 'Não foi possível excluir. Tente novamente.' }
      );
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <section className="flex flex-col gap-4 pb-8">
      <div className="flex items-center gap-2">
        <History size={20} className="text-primary-container" />
        <h2 className="text-base font-semibold text-on-surface">Histórico de orçamentos</h2>
      </div>

      {initialLoading ? (
        <HistorySkeleton />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-zinc-border bg-surface-container/40 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
            <History size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-base font-bold tracking-wide text-on-surface">
              Nenhum orçamento encontrado
            </p>
            <p className="mt-1 text-[15px] font-normal text-on-surface-variant">
              Seus orçamentos salvos vão aparecer aqui, prontos para PDF, status e GPS.
            </p>
          </div>
          <Button onClick={() => navigate('/app/novo')}>
            <FilePlus2 size={20} />
            Criar novo orçamento
          </Button>
        </div>
      ) : (
        <>
          {items.map((orcamento) => (
            <HistoryCard
              key={orcamento.id}
              orcamento={orcamento}
              clientes={clients}
              blocked={isSubmittingId === orcamento.id}
              onToggleStatus={() => handleToggleStatus(orcamento)}
              onDelete={() => setDeleteTarget(orcamento)}
            />
          ))}

          {hasMore ? (
            <button
              type="button"
              onClick={fetchNextPage}
              disabled={pageLoading}
              className="flex h-14 items-center justify-center gap-2 rounded-lg border border-zinc-border bg-surface-container text-[15px] font-semibold text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pageLoading ? (
                <Loader2 size={20} className="animate-spin text-primary-container" />
              ) : (
                <RefreshCw size={20} className="text-primary-container" />
              )}
              {pageLoading ? 'Carregando...' : 'Carregar mais'}
            </button>
          ) : null}
        </>
      )}

      <Modal
        open={deleteTarget != null}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        title="Excluir orçamento"
      >
        <div className="flex flex-col gap-4">
          {deleteTarget ? (
            <p className="text-[15px] text-on-surface">
              Excluir o orçamento{' '}
              <span className="font-mono font-bold text-primary-container">
                #{deleteTarget.numero}
              </span>{' '}
              de <span className="font-bold">{deleteTarget.clienteNome || 'cliente'}</span>? Essa
              ação remove o item do histórico.
            </p>
          ) : (
            <p className="text-[15px] text-on-surface">Excluir este orçamento?</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deleting}
              onClick={handleConfirmDelete}
            >
              {deleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        </div>
      </Modal>

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </section>
  );
}