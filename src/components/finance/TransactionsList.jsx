import { ArrowDownCircle, ArrowUpCircle, Trash2 } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

function shortDate(iso) {
  const [y, m, d] = String(iso ?? '').split('-');
  return m && d ? `${d}/${m}` : '';
}

export default function TransactionsList({ despesas, receitas, onDeleteReceita, onDeleteDespesa }) {
  const { formatCurrency } = useAppData();
  const items = [
    ...receitas.map((item) => ({
      id: item.id,
      kind: 'receita',
      descricao: item.descricao || 'Entrada avulsa',
      categoria: item.categoria || '',
      valor: item.valor,
      data: item.data,
    })),
    ...despesas.map((item) => ({
      id: item.id,
      kind: 'despesa',
      descricao: item.descricao || 'Saída',
      categoria: item.categoria || '',
      valor: item.valor,
      data: item.data,
    })),
  ].sort((a, b) => String(b.data).localeCompare(String(a.data)));

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-border bg-surface-container/40 px-6 py-8 text-center text-[15px] text-on-surface-variant">
        Nenhum lançamento neste mês.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={`${item.kind}-${item.id}`}
          className="flex items-center gap-3 rounded-xl border border-zinc-border bg-surface-container px-3 py-3"
        >
          {item.kind === 'receita' ? (
            <ArrowUpCircle size={24} className="shrink-0 text-tertiary" />
          ) : (
            <ArrowDownCircle size={24} className="shrink-0 text-error" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-on-surface">{item.descricao}</p>
            <div className="flex items-center gap-2">
              {item.categoria ? (
                <span className="rounded bg-surface-container-high px-1.5 py-0.5 text-xs font-semibold text-on-surface-variant">
                  {item.categoria}
                </span>
              ) : null}
              <p className="text-[15px] text-on-surface-variant">{shortDate(item.data)}</p>
            </div>
          </div>
          <p
            className={`shrink-0 font-mono text-[15px] font-extrabold ${
              item.kind === 'receita' ? 'text-tertiary' : 'text-error'
            }`}
          >
            {item.kind === 'receita' ? '+' : '-'}
            {formatCurrency(item.valor)}
          </p>
          <button
            type="button"
            aria-label="Remover lançamento"
            onClick={() =>
              item.kind === 'receita'
                ? onDeleteReceita(item.id)
                : onDeleteDespesa(item.id)
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:text-error"
          >
            <Trash2 size={19} />
          </button>
        </div>
      ))}
    </div>
  );
}