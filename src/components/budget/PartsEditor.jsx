import { useState } from 'react';
import { Wrench, Plus, Trash2, Boxes } from 'lucide-react';
import Input from '../ui/Input';
import { uid, num, money } from '../../services/budgetService';
import { COMMON_PARTS } from '../../data/budgetPresets';
import { formatBRL } from '../../utils/formatters';

export default function PartsEditor({ pecas, onChangePecas, onNotify }) {
  const [selected, setSelected] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [unitario, setUnitario] = useState('');

  function addPeca() {
    const valor = num(unitario);
    if (!selected) {
      onNotify('Selecione uma peça no dropdown.');
      return;
    }
    if (valor <= 0) {
      onNotify('Informe o valor unitário da peça.');
      return;
    }
    onChangePecas((lista) => [
      ...lista,
      { id: uid(), nome: selected, quantidade, valorVendaUnitario: unitario, custoPago: 0 },
    ]);
    setSelected('');
    setQuantidade('1');
    setUnitario('');
  }

  function removePeca(id) {
    onChangePecas((lista) => lista.filter((item) => item.id !== id));
  }

  function itemSubtotal(item) {
    return money(num(item.quantidade) * num(item.valorVendaUnitario));
  }

  const totalPecas = pecas.reduce((acc, item) => acc + itemSubtotal(item), 0);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Boxes size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold text-on-surface">Peças</h3>
      </div>

      <select
        aria-label="Selecionar peça"
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        className="h-14 w-full rounded-lg border border-zinc-border bg-surface-container px-4 text-[15px] text-on-surface outline-none transition-colors focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
      >
        <option value="">Selecionar peça...</option>
        {COMMON_PARTS.map((nome) => (
          <option key={nome} value={nome}>
            {nome}
          </option>
        ))}
      </select>

      <div className="flex items-end gap-2">
        <div className="w-20 shrink-0">
          <Input
            label="Qtd"
            inputMode="numeric"
            value={quantidade}
            onChange={(event) => setQuantidade(event.target.value)}
          />
        </div>
        <div className="flex-1">
          <Input
            label="R$ Unitário"
            prefix="R$"
            inputMode="decimal"
            placeholder="0,00"
            value={unitario}
            onChange={(event) => setUnitario(event.target.value)}
          />
        </div>
        <button
          type="button"
          aria-label="Adicionar peça"
          onClick={addPeca}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container shadow-yellow-bevel transition-all active:translate-y-0.5 active:shadow-none"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>

      {pecas.length > 0 ? (
        pecas.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-zinc-border bg-surface-container px-3 py-3"
          >
            <Wrench size={20} className="shrink-0 text-on-surface-variant" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-on-surface">{item.nome}</p>
              <p className="text-[15px] text-on-surface-variant">
                {formatBRL(num(item.valorVendaUnitario))} × {item.quantidade}
              </p>
            </div>
            <span className="shrink-0 font-mono text-[15px] font-bold text-primary-container">
              {formatBRL(itemSubtotal(item))}
            </span>
            <button
              type="button"
              aria-label={`Remover ${item.nome}`}
              onClick={() => removePeca(item.id)}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-error-container/50 text-error transition-colors hover:bg-error/20"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))
      ) : (
        <p className="rounded-xl border border-dashed border-zinc-border bg-surface-container/40 px-4 py-6 text-center text-[15px] text-on-surface-variant">
          Nenhuma peça adicionada ainda.
        </p>
      )}

      {pecas.length > 0 ? (
        <div className="flex items-center justify-between rounded-xl bg-surface-container-high px-4 py-3">
          <span className="text-[15px] font-semibold text-on-surface-variant">Subtotal peças</span>
          <span className="font-mono text-[15px] font-bold text-primary-container">
            {formatBRL(totalPecas)}
          </span>
        </div>
      ) : null}
    </section>
  );
}