import { useState } from 'react';
import { Search, Plus, BookOpen, Trash2, Wrench, Clock3, Coins } from 'lucide-react';
import Input from '../ui/Input';
import { uid, num, money } from '../../services/budgetService';
import { SUGGESTED_SERVICES } from '../../data/budgetPresets';
import { formatBRL } from '../../utils/formatters';

const NEW_ITEM = { quantidade: '1', tempoHoras: '1', valorExtra: '' };

export default function ServicesEditor({ valorHoraAplicado, servicos, onChangeServicos, onNotify }) {
  const [busca, setBusca] = useState('');

  const base = SUGGESTED_SERVICES;
  const addedNames = new Set(servicos.map((item) => item.nome));
  const options = busca.trim()
    ? base
        .concat(servicos.map((item) => item.nome))
        .filter((nome, i, arr) => nome.toLowerCase().includes(busca.trim().toLowerCase()) && arr.indexOf(nome) === i)
        .slice(0, 6)
    : [];

  function addServico(nome) {
    const nomeFinal = nome.trim();
    if (!nomeFinal) return;
    onChangeServicos((lista) => [...lista, { id: uid(), nome: nomeFinal, ...NEW_ITEM }]);
    setBusca('');
  }

  function updateItem(id, campo, value) {
    onChangeServicos((lista) =>
      lista.map((item) => (item.id === id ? { ...item, [campo]: value } : item))
    );
  }

  function removeItem(id) {
    onChangeServicos((lista) => lista.filter((item) => item.id !== id));
  }

  function itemSubtotal(item) {
    return money((num(item.tempoHoras) * num(valorHoraAplicado) + num(item.valorExtra)) * num(item.quantidade));
  }

  const totalServicos = servicos.reduce((acc, item) => acc + itemSubtotal(item), 0);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Wrench size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold text-on-surface">Serviços</h3>
        {valorHoraAplicado ? (
          <span className="ml-auto rounded-lg bg-surface-container-high px-2.5 py-1 text-xs font-semibold text-primary-container">
            Hora: {formatBRL(valorHoraAplicado)}
          </span>
        ) : null}
      </div>
      {!valorHoraAplicado ? (
        <p className="text-[15px] text-on-surface-variant">
          Configure seus custos em Ajustes para o valor hora calculado. Enquanto isso, use o Valor
          Extra para compor o preço.
        </p>
      ) : null}

      <div className="relative">
        <Input
          icon={Search}
          placeholder="Buscar serviço..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
        {options.length > 0 ? (
          <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-zinc-border bg-surface-container-high shadow-dewalt-bevel">
            {options.map((nome) => (
              <button
                key={nome}
                type="button"
                onClick={() => addServico(nome)}
                className="flex min-h-[48px] w-full items-center px-4 text-left text-[15px] text-on-surface transition-colors hover:bg-surface-container-highest"
              >
                <Plus size={16} className="mr-2 shrink-0 text-primary-container" />
                {nome}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => addServico(busca)}
          disabled={!busca.trim()}
          className="flex h-14 items-center justify-center gap-2 rounded-lg border border-primary-container/70 text-[15px] font-bold text-primary-container transition-colors hover:bg-primary-container/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={20} />
          Avulso
        </button>
        <button
          type="button"
          onClick={() => {
            const q = encodeURIComponent(`manual montagem pdf ${busca.trim()}`);
            window.open(`https://www.google.com/search?q=${q}`, '_blank', 'noopener,noreferrer');
          }}
          disabled={!busca.trim()}
          className="flex h-14 items-center justify-center gap-2 rounded-lg bg-secondary-container/10 text-[15px] font-bold text-secondary transition-colors hover:bg-secondary-container/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <BookOpen size={20} />
          Buscar manual
        </button>
      </div>

      {servicos.length > 0 ? (
        servicos.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-xl border border-zinc-border bg-surface-container p-3"
          >
            <div className="flex items-center gap-3">
              <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-on-surface">
                {item.nome}
              </p>
              <button
                type="button"
                aria-label={`Remover ${item.nome}`}
                onClick={() => removeItem(item.id)}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-error-container/50 text-error transition-colors hover:bg-error/20"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="Qtd"
                inputMode="numeric"
                value={item.quantidade}
                onChange={(event) => updateItem(item.id, 'quantidade', event.target.value)}
              />
              <Input
                label="Tempo (h)"
                inputMode="decimal"
                icon={Clock3}
                value={item.tempoHoras}
                onChange={(event) => updateItem(item.id, 'tempoHoras', event.target.value)}
              />
              <Input
                label="Extra (R$)"
                inputMode="decimal"
                icon={Coins}
                value={item.valorExtra}
                onChange={(event) => updateItem(item.id, 'valorExtra', event.target.value)}
              />
            </div>
            <p className="text-[15px] text-on-surface-variant">
              Subtotal:{' '}
              <span className="font-mono font-bold text-primary-container">
                {formatBRL(itemSubtotal(item))}
              </span>
            </p>
          </div>
        ))
      ) : (
        <p className="rounded-xl border border-dashed border-zinc-border bg-surface-container/40 px-4 py-6 text-center text-[15px] text-on-surface-variant">
          Nenhum serviço adicionado. Use a busca acima ou toque em Avulso.
        </p>
      )}

      {servicos.length > 0 ? (
        <div className="flex items-center justify-between rounded-xl bg-surface-container-high px-4 py-3">
          <span className="text-[15px] font-semibold text-on-surface-variant">Subtotal serviços</span>
          <span className="font-mono text-[15px] font-bold text-primary-container">
            {formatBRL(totalServicos)}
          </span>
        </div>
      ) : null}
    </section>
  );
}