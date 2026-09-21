import { CheckCircle2, RotateCcw, Navigation, FileText, Trash2, Loader2 } from 'lucide-react';
import { formatDateTimeBR, formatDateBR } from '../../utils/formatters';
import { buildSnapshotFromDoc, buildEnderecoCompleto } from '../../services/historyService';
import { generateBudgetPdf } from '../../services/pdfService';
import { useAppData } from '../../context/AppDataContext';

const STATUS_META = {
  pendente: {
    label: 'Pendente',
    className: 'bg-[#E5A93C]/20 text-[#E5A93C]',
  },
  pago: {
    label: 'Pago',
    className: 'bg-tertiary/20 text-tertiary',
  },
};

export default function HistoryCard({ orcamento, clientes, blocked, onToggleStatus, onDelete }) {
  const { formatCurrency } = useAppData();
  const meta = STATUS_META[orcamento.status] || STATUS_META.pendente;
  const endereco = buildEnderecoCompleto(orcamento, clientes);
  const temEndereco = endereco.trim().length > 0;

  function handlePdf() {
    if (blocked) return;
    try {
      const snapshot = buildSnapshotFromDoc(orcamento);
      if (!snapshot.numero && !snapshot.totalGeral) return;
      generateBudgetPdf(snapshot);
    } catch {
      // Tratado pela view (toast) — erro silencioso aqui apenas para nao travar o card
    }
  }

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-zinc-border bg-surface-container p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
          <span className="text-[15px] font-extrabold">
            {String(orcamento.clienteNome ?? '?').slice(0, 1)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-on-surface">
            {orcamento.clienteNome || 'Cliente não informado'}
          </p>
          <p className="mt-0.5 truncate font-mono text-[15px] text-on-surface-variant">
            {formatDateTimeBR(orcamento.createdAt)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${meta.className}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-mono text-[15px] font-bold text-primary-container">
            #{orcamento.numero}
          </p>
          {orcamento.cidade ? (
            <p className="mt-0.5 text-[15px] text-on-surface-variant">{orcamento.cidade}</p>
          ) : null}
          {orcamento.dataServico ? (
            <p className="text-[15px] text-on-surface-variant">
              Montagem: {formatDateBR(orcamento.dataServico)}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 font-mono text-3xl font-extrabold tracking-tight text-on-surface">
          {formatCurrency(orcamento.totalGeral)}
        </p>
      </div>

      <div className="flex items-center gap-2 border-t border-zinc-border pt-3">
        <button
          type="button"
          disabled={blocked}
          onClick={onToggleStatus}
          className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-lg text-[15px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            orcamento.status === 'pago'
              ? 'bg-on-surface/10 text-on-surface hover:bg-on-surface/15'
              : 'bg-tertiary/10 text-tertiary hover:bg-tertiary/20'
          }`}
        >
          {blocked ? (
            <Loader2 size={20} className="animate-spin" />
          ) : orcamento.status === 'pago' ? (
            <RotateCcw size={20} />
          ) : (
            <CheckCircle2 size={20} />
          )}
          {orcamento.status === 'pago' ? 'Reabrir' : 'Receber'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <a
          href={temEndereco ? `https://waze.com/ul?q=${encodeURIComponent(endereco)}` : undefined}
          target={temEndereco ? '_blank' : undefined}
          rel={temEndereco ? 'noopener noreferrer' : undefined}
          aria-label={temEndereco ? 'Abrir endereço no Waze' : 'Endereço não cadastrado'}
          className={`flex h-14 items-center justify-center gap-2 rounded-lg text-[15px] font-bold transition-colors ${
            temEndereco
              ? 'bg-secondary-container/10 text-secondary hover:bg-secondary-container/20'
              : 'cursor-not-allowed bg-surface-container-high text-on-surface-variant opacity-50'
          }`}
        >
          <Navigation size={20} />
          GPS
        </a>
        <button
          type="button"
          disabled={blocked}
          onClick={handlePdf}
          className="flex h-14 items-center justify-center gap-2 rounded-lg bg-tertiary/10 text-[15px] font-bold text-tertiary transition-colors hover:bg-tertiary/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FileText size={20} />
          PDF
        </button>
        <button
          type="button"
          disabled={blocked}
          onClick={onDelete}
          className="flex h-14 items-center justify-center gap-2 rounded-lg bg-error-container/50 text-[15px] font-bold text-error transition-colors hover:bg-error/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={20} />
          Excluir
        </button>
      </div>
    </article>
  );
}