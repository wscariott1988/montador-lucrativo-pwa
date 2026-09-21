import { BadgePercent } from 'lucide-react';
import Input from '../ui/Input';
import { formatBRL } from '../../utils/formatters';

export default function TotalCard({ desconto, onDesconto, totais, validadeDias = 7, idPrefix }) {
  const hasDesconto = totais.descontoPercentual > 0;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <BadgePercent size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold tracking-wide text-on-surface">Total</h3>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-zinc-border bg-surface-container p-4">
        <Input
          id={`${idPrefix}-desconto`}
          label="Desconto (%)"
          inputMode="decimal"
          placeholder="0"
          icon={BadgePercent}
          value={desconto}
          onChange={(event) =>
            onDesconto(event.target.value.replace(/[^\d.,]/g, ''))
          }
        />

        <dl className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[15px]">
            <dt className="text-on-surface-variant">Subtotal Serviços</dt>
            <dd className="font-mono font-semibold text-on-surface">
              {formatBRL(totais.totalServicos)}
            </dd>
          </div>
          <div className="flex items-center justify-between text-[15px]">
            <dt className="text-on-surface-variant">Subtotal Peças</dt>
            <dd className="font-mono font-semibold text-on-surface">
              {formatBRL(totais.totalPecas)}
            </dd>
          </div>
          {totais.deslocamento > 0 ? (
            <div className="flex items-center justify-between text-[15px]">
              <dt className="text-on-surface-variant">Deslocamento</dt>
              <dd className="font-mono font-semibold text-on-surface">
                {formatBRL(totais.deslocamento)}
              </dd>
            </div>
          ) : null}
          {hasDesconto ? (
            <div className="flex items-center justify-between text-[15px]">
              <dt className="text-on-surface-variant">
                Desconto ({totais.descontoPercentual}%)
              </dt>
              <dd className="font-mono font-semibold text-tertiary">
                - {formatBRL(totais.descontoValor)}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      {/* Total Geral em destaque gigante na paleta amarela DeWalt */}
      <div className="rounded-2xl bg-primary-container px-5 pb-5 pt-3 shadow-yellow-bevel">
        <p className="text-sm font-bold uppercase tracking-widest text-on-primary-container/70">
          Total Geral
        </p>
        <p className="mt-1 font-mono text-5xl font-black leading-none text-on-primary-container">
          {formatBRL(totais.totalGeral)}
        </p>
        <p className="mt-2 text-[15px] font-semibold text-on-primary-container/80">
          Proposta válida por {Math.max(1, validadeDias)} dias
        </p>
      </div>
    </section>
  );
}