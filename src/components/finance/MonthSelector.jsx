import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthLabel } from '../../utils/formatters';

export default function MonthSelector({ ano, mes, onPrev, onNext, canGoNext }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        aria-label="Mês anterior"
        onClick={onPrev}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high"
      >
        <ChevronLeft size={26} />
      </button>
      <p className="min-w-0 flex-1 truncate text-center text-[15px] font-bold capitalize text-on-surface">
        {formatMonthLabel(ano, mes)}
      </p>
      <button
        type="button"
        aria-label="Próximo mês"
        onClick={onNext}
        disabled={!canGoNext}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={26} />
      </button>
    </div>
  );
}