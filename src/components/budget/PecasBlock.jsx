import { useState } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';
import Input from '../ui/Input';
import { CATALOGO_PECAS } from '../../data/catalogo';
import { formatBRL } from '../../utils/formatters';
import { calcularPeca, gerarIdItem } from '../../utils/budget';

export default function PecasBlock({ pecas, onAdd, onUpdate, onRemove, idPrefix }) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [valorUnitario, setValorUnitario] = useState('');

  const nomeValido = nome.trim() !== '';

  function handleAdd() {
    if (!nomeValido) return;
    onAdd({
      id: gerarIdItem(),
      nome: nome.trim(),
      quantidade: quantidade || '1',
      valorUnitario,
    });
    setQuantidade('1');
    setValorUnitario('');
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Package size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold tracking-wide text-on-surface">Peças</h3>
        <span className="ml-auto text-xs font-bold uppercase tracking-wide text-on-surface-variant">
          {pecas.length} {pecas.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      <div className="rounded-xl border border-zinc-border bg-surface-container p-4">
        <label className="block w-full">
          <span className="mb-1 block text-xs font-semibold tracking-wide text-on-surface-variant">
            Peça
          </span>
          <select
            id={`${idPrefix}-peca-select`}
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            className="h-14 w-full rounded-lg border border-zinc-border bg-surface-container px-4 text-[15px] text-on-surface outline-none transition-colors focus:border-primary-container"
          >
            <option value="">Selecionar...</option>
            {CATALOGO_PECAS.map((peca) => (
              <option key={peca.nome} value={peca.nome} className="bg-surface-container">
                {peca.nome}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-3 grid grid-cols-[88px_1fr_64px] gap-2">
          <Input
            id={`${idPrefix}-peca-qtd`}
            label="Qtd"
            inputMode="numeric"
            value={quantidade}
            onChange={(event) => setQuantidade(event.target.value.replace(/[^\d]/g, ''))}
          />
          <Input
            id={`${idPrefix}-peca-valor`}
            label="Valor Unitário"
            prefix="R$"
            inputMode="decimal"
            value={valorUnitario}
            onChange={(event) => setValorUnitario(event.target.value.replace(/[^\d.,]/g, ''))}
          />
          <button
            type="button"
            aria-label="Adicionar peça"
            onClick={handleAdd}
            disabled={!nomeValido}
            className="mt-6 flex h-14 items-center justify-center rounded-lg bg-primary-container text-on-primary-container shadow-yellow-bevel transition-all active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={26} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {pecas.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-border px-4 py-6 text-center text-[15px] text-on-surface-variant">
          Selecione uma peça, informe quantidade e valor unitário e toque em “+”.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {pecas.map((peca) => {
            const subtotal = calcularPeca(peca);
            return (
              <div
                key={peca.id}
                className="flex items-center gap-2 rounded-xl border border-zinc-border bg-surface-container p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-on-surface">{peca.nome}</p>
                  <p className="mt-0.5 text-[15px] text-on-surface-variant">
                    {peca.quantidade}x {formatBRL(peca.valorUnitario)} ={' '}
                    <span className="font-mono font-bold text-primary-container">
                      {formatBRL(subtotal)}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remover ${peca.nome}`}
                  onClick={() => onRemove(peca.id)}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-error-container/50 text-error transition-colors hover:bg-error/20"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}