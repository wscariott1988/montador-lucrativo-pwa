import { CreditCard } from 'lucide-react';
import Input from '../ui/Input';

const FORMAS = ['Pix', 'Dinheiro', 'Cartão'];

export default function PaymentSection({
  formaPagamento,
  onFormaPagamento,
  condicoes,
  onCondicoes,
  observacoes,
  onObservacoes,
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <CreditCard size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold text-on-surface">Pagamento</h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {FORMAS.map((forma) => (
          <button
            key={forma}
            type="button"
            onClick={() => onFormaPagamento(forma)}
            className={`h-14 rounded text-[15px] font-bold transition-colors ${
              formaPagamento === forma
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {forma}
          </button>
        ))}
      </div>

      <Input
        label="Condições"
        placeholder="Ex: 3x no cartão"
        value={condicoes}
        onChange={(event) => onCondicoes(event.target.value)}
      />

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wide text-on-surface-variant">
          Observações
        </span>
        <textarea
          rows={3}
          placeholder="Observações sobre a montagem, garagem, elevador... (opcional)"
          value={observacoes}
          onChange={(event) => onObservacoes(event.target.value)}
          className="w-full min-h-14 resize-none rounded-lg border border-zinc-border bg-surface-container px-4 py-3 text-[15px] text-on-surface placeholder:text-on-surface-variant/60 outline-none transition-colors focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
        />
      </label>
    </section>
  );
}