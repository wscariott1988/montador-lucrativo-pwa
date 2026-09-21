import { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Minus, Plus } from 'lucide-react';
import Input from '../ui/Input';
import { parseBRLtoNumber, toISODate } from '../../utils/formatters';

export default function TransactionForm({ tipo, onSubmit }) {
  const isSaida = tipo === 'saida';
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const numero = parseBRLtoNumber(valor);
    if (numero <= 0) {
      setError('Informe um valor maior que zero.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSubmit({ descricao: descricao.trim(), valor: numero, data: toISODate() });
      setValor('');
      setDescricao('');
    } catch {
      setError('Falha ao salvar o lançamento. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-zinc-border bg-surface-container p-4"
    >
      <div className={`flex items-center gap-2 ${isSaida ? 'text-error' : 'text-tertiary'}`}>
        {isSaida ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
        <h3 className="text-base font-semibold text-on-surface">
          {isSaida ? 'Saídas / Despesas' : 'Entradas avulsas'}
        </h3>
      </div>

      <Input
        label={isSaida ? 'Descrição da despesa' : 'Descrição da entrada'}
        placeholder={isSaida ? 'Ex: Peças, ferramentas, combustível' : 'Ex: Antecipação, depósito'}
        value={descricao}
        onChange={(event) => setDescricao(event.target.value)}
      />

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label="Valor (R$)"
            prefix="R$"
            inputMode="decimal"
            placeholder="0,00"
            value={valor}
            onChange={(event) => setValor(event.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          aria-label={isSaida ? 'Adicionar despesa' : 'Adicionar entrada'}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg transition-all active:translate-y-0.5 ${
            isSaida
              ? 'bg-error text-on-error shadow-red-bevel hover:bg-[#DC2626] active:shadow-none'
              : 'bg-tertiary text-on-tertiary hover:bg-tertiary-container active:shadow-none'
          }`}
        >
          {isSaida ? <Minus size={30} strokeWidth={3} /> : <Plus size={30} strokeWidth={3} />}
        </button>
      </div>

      {error ? <p className="text-[15px] font-semibold text-error">{error}</p> : null}
    </form>
  );
}