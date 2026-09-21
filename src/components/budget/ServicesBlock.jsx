import { useMemo, useRef, useState } from 'react';
import { Search, Plus, ExternalLink, Trash2, Wrench } from 'lucide-react';
import Input from '../ui/Input';
import { CATALOGO_SERVICOS } from '../../data/catalogo';
import { formatBRL } from '../../utils/formatters';
import { calcularServico, gerarIdItem } from '../../utils/budget';

function novoItem(nome) {
  return { id: gerarIdItem(), nome, tempoHoras: '0', valorExtra: '', quantidade: '1' };
}

export default function ServicesBlock({ servicos, valorHora, onAdd, onUpdate, onRemove, idPrefix }) {
  const [busca, setBusca] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const sugestoes = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return [];
    return CATALOGO_SERVICOS.filter((servico) =>
      servico.nome.toLowerCase().includes(termo)
    ).slice(0, 6);
  }, [busca]);

  function addServico(nome) {
    onAdd(novoItem(nome));
    setBusca('');
    inputRef.current?.focus();
  }

  function buscarManual() {
    const termo = busca.trim() || 'manual de montagem de móveis';
    window.open(`https://www.google.com/search?q=${encodeURIComponent(`${termo} manual PDF`)}`, '_blank', 'noopener');
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Wrench size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold tracking-wide text-on-surface">Serviços</h3>
        <span className="ml-auto text-xs font-bold uppercase tracking-wide text-on-surface-variant">
          {servicos.length} {servicos.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      <div className="relative">
        <Input
          id={`${idPrefix}-busca-servico`}
          icon={Search}
          placeholder="Buscar serviço..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
        />
        {focused && sugestoes.length > 0 ? (
          <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-zinc-border bg-surface-container-high shadow-dewalt-bevel">
            {sugestoes.map((servico) => (
              <button
                key={servico.nome}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  addServico(servico.nome);
                }}
                className="flex min-h-[48px] w-full items-center gap-2 px-4 text-left text-[15px] font-semibold text-on-surface transition-colors hover:bg-primary-container hover:text-on-primary-container"
              >
                <Search size={16} className="shrink-0" />
                {servico.nome}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => addServico('')}
          className="flex h-12 items-center justify-center gap-2 rounded-lg border border-zinc-border bg-surface-container text-[15px] font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
        >
          <Plus size={20} />
          + Avulso
        </button>
        <button
          type="button"
          onClick={buscarManual}
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-secondary-container/15 text-[15px] font-semibold text-secondary-container transition-colors hover:bg-secondary-container/25"
        >
          <ExternalLink size={20} />
          Buscar Manual
        </button>
      </div>

      {servicos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-border px-4 py-6 text-center text-[15px] text-on-surface-variant">
          Toque na busca, use “+ Avulso” ou “Buscar Manual” para adicionar um serviço.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {servicos.map((servico) => {
            const subtotal = calcularServico(servico, valorHora);
            return (
              <div
                key={servico.id}
                className="rounded-xl border border-zinc-border bg-surface-container p-4"
              >
                <div className="flex items-start gap-2">
                  <Input
                    id={`${idPrefix}-servico-nome-${servico.id}`}
                    className="flex-1"
                    placeholder="Nome do serviço"
                    value={servico.nome}
                    onChange={(event) => onUpdate(servico.id, { nome: event.target.value })}
                  />
                  <button
                    type="button"
                    aria-label="Remover serviço"
                    onClick={() => onRemove(servico.id)}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-error-container/50 text-error transition-colors hover:bg-error/20"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Input
                    id={`${idPrefix}-servico-qtd-${servico.id}`}
                    label="Qtd"
                    inputMode="numeric"
                    value={servico.quantidade}
                    onChange={(event) =>
                      onUpdate(servico.id, { quantidade: event.target.value.replace(/[^\d]/g, '') })
                    }
                  />
                  <Input
                    id={`${idPrefix}-servico-horas-${servico.id}`}
                    label="Horas"
                    inputMode="decimal"
                    value={servico.tempoHoras}
                    onChange={(event) =>
                      onUpdate(servico.id, {
                        tempoHoras: event.target.value.replace(/[^\d.,]/g, ''),
                      })
                    }
                  />
                  <Input
                    id={`${idPrefix}-servico-extra-${servico.id}`}
                    label="Valor Extra"
                    prefix="R$"
                    inputMode="decimal"
                    value={servico.valorExtra}
                    onChange={(event) =>
                      onUpdate(servico.id, {
                        valorExtra: event.target.value.replace(/[^\d.,]/g, ''),
                      })
                    }
                  />
                </div>
                <p className="mt-3 text-right font-mono text-[15px] font-bold text-primary-container">
                  {formatBRL(subtotal)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}