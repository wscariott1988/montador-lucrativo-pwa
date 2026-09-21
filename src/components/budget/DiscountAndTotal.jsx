import { Percent, BadgeDollarSign, Lock } from 'lucide-react';
import Input from '../ui/Input';
import { useAppData } from '../../context/AppDataContext';

export default function DiscountAndTotal({
  descontoTipo,
  onDescontoTipo,
  descontoValor,
  onDescontoValor,
  totalServicos,
  totalPecas,
  taxaDeslocamento,
  subtotal,
  descontoAplicado,
  totalGeral,
  acoesTravadas,
}) {
  const { formatCurrency, privacidade } = useAppData();
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-border bg-surface-container p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-semibold text-on-surface">Desconto</span>
          <div className="grid grid-cols-2 gap-1 rounded bg-surface-container-high p-1">
            {[
              { id: 'valor', label: 'R$' },
              { id: 'percentual', label: '%' },
            ].map((tipo) => (
              <button
                key={tipo.id}
                type="button"
                onClick={() => onDescontoTipo(tipo.id)}
                className={`h-11 min-w-14 rounded px-4 text-[15px] font-bold transition-colors ${
                  descontoTipo === tipo.id
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tipo.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label={descontoTipo === 'percentual' ? 'Percentual (%)' : 'Valor (R$)'}
          prefix={descontoTipo === 'percentual' ? '%' : 'R$'}
          inputMode="decimal"
          placeholder={privacidade ? '***' : '0'}
          icon={descontoTipo === 'percentual' ? Percent : BadgeDollarSign}
          value={privacidade ? '' : descontoValor}
          onChange={(event) => onDescontoValor(event.target.value)}
          disabled={privacidade}
        />
      </div>

      <div className="flex flex-col gap-3 rounded border border-[#FFC800]/40 bg-surface-container p-4">
        <div className="flex items-center justify-between text-[15px] text-on-surface-variant">
          <span>Serviços + Peças + Deslocamento</span>
          <span className="font-mono font-bold text-on-surface">
            {formatCurrency(subtotal)}
          </span>
        </div>
        {descontoAplicado > 0 ? (
          <div className="flex items-center justify-between text-[15px] text-on-surface-variant">
            <span>
              Desconto ({descontoTipo === 'percentual' ? '%' : 'R$'}:{' '}
              {privacidade
                ? '***'
                : descontoTipo === 'percentual'
                  ? Number(descontoValor) || 0
                  : formatCurrency(descontoValor)}
              )
            </span>
            <span className="font-mono font-bold text-error">-{formatCurrency(descontoAplicado)}</span>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-bold text-on-surface">Total geral</span>
          <span className="font-mono text-4xl font-extrabold tracking-tight text-primary-container">
            {formatCurrency(totalGeral)}
          </span>
        </div>
      </div>

      {acoesTravadas ? (
        <p className="flex items-center gap-2 text-[15px] font-semibold text-on-surface-variant">
          <Lock size={18} className="shrink-0" />
          Adicione serviços ou peças para liberar PDF, WhatsApp e salvar no histórico.
        </p>
      ) : null}
    </section>
  );
}