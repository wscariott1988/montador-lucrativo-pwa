import { Gauge } from 'lucide-react';
import Alert from '../ui/Alert';
import { useAppData } from '../../context/AppDataContext';

const LIMITE_MEI = 81000;

export default function MeiPanel({ total, year }) {
  const { formatCurrency } = useAppData();
  const percent = Math.min(100, (total / LIMITE_MEI) * 100);
  const ultrapassou = total > LIMITE_MEI;

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-border bg-surface-container p-4">
      <div className="flex items-center gap-2">
        <Gauge size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold text-on-surface">Monitoramento MEI ({year})</h3>
      </div>

      <div>
        <p className="font-mono text-2xl font-extrabold text-primary-container">
          {formatCurrency(total)}
        </p>
        <p className="text-[15px] font-normal text-on-surface-variant">
          Limite anual: R$ 81.000,00
        </p>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className={`h-full rounded-full transition-all ${
            ultrapassou ? 'bg-error' : 'bg-primary-container'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {ultrapassou ? (
        <Alert tone="error">
          Você ultrapassou o limite anual do MEI (R$ 81.000,00). Procure um contador para avaliar
          a migração de regime tributário.
        </Alert>
      ) : null}
    </section>
  );
}