import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatBRL } from '../../utils/formatters';

export default function MonthBalance({ faturado, saidas, saldo }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2 rounded-xl border border-zinc-border bg-surface-container p-4">
          <div className="flex items-center gap-2 text-tertiary">
            <TrendingUp size={18} />
            <span className="text-[15px] font-semibold">Faturado</span>
          </div>
          <p className="font-mono text-[15px] font-extrabold text-tertiary">
            {formatBRL(faturado)}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-zinc-border bg-surface-container p-4">
          <div className="flex items-center gap-2 text-error">
            <TrendingDown size={18} />
            <span className="text-[15px] font-semibold">Saídas</span>
          </div>
          <p className="font-mono text-[15px] font-extrabold text-error">{formatBRL(saidas)}</p>
        </div>
      </div>

      <div className="rounded-xl bg-surface-container-high p-4 text-center">
        <span className="text-[15px] font-semibold text-on-surface-variant">Saldo líquido</span>
        <p
          className={`mt-1 font-mono text-3xl font-extrabold ${
            saldo >= 0 ? 'text-tertiary' : 'text-error'
          }`}
        >
          {formatBRL(saldo)}
        </p>
      </div>
    </section>
  );
}