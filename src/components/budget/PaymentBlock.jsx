import { CreditCard, MessageSquareText, PencilLine } from 'lucide-react';
import Input from '../ui/Input';

const FORMAS = ['Pix', 'Dinheiro', 'Cartão'];

export default function PaymentBlock({
  formas,
  onToggleForma,
  condicoes,
  onCondicoes,
  observacoes,
  onObservacoes,
  idPrefix,
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <CreditCard size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold tracking-wide text-on-surface">
          Pagamento &amp; Notas
        </h3>
      </div>

      <div>
        <span className="mb-1 block text-xs font-semibold tracking-wide text-on-surface-variant">
          Forma de pagamento
        </span>
        <div className="flex gap-2">
          {FORMAS.map((forma) => {
            const ativa = formas.includes(forma);
            return (
              <button
                key={forma}
                type="button"
                onClick={() => onToggleForma(forma)}
                aria-pressed={ativa}
                className={`h-12 flex-1 rounded-full px-4 text-[15px] font-bold tracking-wide transition-all active:scale-[0.97] ${
                  ativa
                    ? 'bg-primary-container text-on-primary-container shadow-yellow-bevel'
                    : 'border border-zinc-border bg-surface-container text-on-surface-variant'
                }`}
              >
                {forma}
              </button>
            );
          })}
        </div>
      </div>

      <Input
        id={`${idPrefix}-condicoes`}
        label="Condições"
        placeholder='Ex: "3x sem juros" ou "50% de entrada"'
        icon={PencilLine}
        value={condicoes}
        onChange={(event) => onCondicoes(event.target.value)}
      />

      <label className="block w-full">
        <span className="mb-1 block text-xs font-semibold tracking-wide text-on-surface-variant">
          Observações gerais
        </span>
        <div className="relative w-full">
          <MessageSquareText
            size={20}
            className="pointer-events-none absolute left-4 top-4 -translate-y-1/2 text-on-surface-variant"
          />
          <textarea
            id={`${idPrefix}-observacoes`}
            placeholder="Observações, garantias, detalhes..."
            rows={3}
            value={observacoes}
            onChange={(event) => onObservacoes(event.target.value)}
            className="w-full rounded-lg border border-zinc-border bg-surface-container px-4 py-3 pl-12 text-[15px] text-on-surface placeholder:text-on-surface-variant/60 outline-none transition-colors focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
          />
        </div>
      </label>
    </section>
  );
}