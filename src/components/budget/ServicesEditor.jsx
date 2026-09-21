import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, BookOpen, Trash2, Wrench, Clock3, Coins, X } from 'lucide-react';
import Input from '../ui/Input';
import { uid, num, money } from '../../services/budgetService';
import { SUGGESTED_SERVICES } from '../../data/budgetPresets';
import { useAppData } from '../../context/AppDataContext';

const NEW_ITEM = { quantidade: '1', tempoHoras: '1', valorExtra: '' };
const FREQ_KEY = 'ml_freq_servicos';
const MAX_SUGESTOES = 8;

function loadFreq() {
  try {
    const raw = window.localStorage.getItem(FREQ_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveFreq(freq) {
  try {
    window.localStorage.setItem(FREQ_KEY, JSON.stringify(freq));
  } catch {
    // Storage indisponivel: frequencia nao persiste, segue apenas em memoria
  }
}

export default function ServicesEditor({ valorHoraAplicado, servicos, onChangeServicos, onNotify }) {
  const { formatCurrency, privacidade } = useAppData();
  const [busca, setBusca] = useState('');
  const [focused, setFocused] = useState(false);
  const [freq, setFreq] = useState(loadFreq);
  const dropdownRef = useRef(null);

  // Ordena a lista: "Mais Utilizados" (frequencia) primeiro, depois alfabetica.
  const ordered = useMemo(() => {
    return [...SUGGESTED_SERVICES].sort(
      (a, b) => (freq[b] || 0) - (freq[a] || 0) || a.localeCompare(b, 'pt-BR')
    );
  }, [freq]);

  const termo = busca.trim();
  const termoLower = termo.toLowerCase();

  // Ao focar (sem digitação) abre IMEDIATAMENTE a lista completa ordenada;
  // mantendo o filtro ativo durante a digitação.
  const options = useMemo(() => {
    if (!termo) return ordered.slice(0, MAX_SUGESTOES);
    return ordered
      .filter((nome) => nome.toLowerCase().includes(termoLower))
      .slice(0, MAX_SUGESTOES);
  }, [termo, termoLower, ordered]);

  const avulsoSugerido = termo && !SUGGESTED_SERVICES.some((n) => n.toLowerCase() === termoLower);

  // Fecha o dropdown ao tocar fora do campo.
  useEffect(() => {
    function onDocClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function registrarUso(nome) {
    setFreq((prev) => {
      const next = { ...prev, [nome]: (prev[nome] || 0) + 1 };
      saveFreq(next);
      return next;
    });
  }

  function addServico(nomeFinal) {
    const nome = String(nomeFinal ?? '').trim();
    if (!nome) return;
    registrarUso(nome);
    onChangeServicos((lista) => [...lista, { id: uid(), nome, ...NEW_ITEM }]);
    setBusca('');
    setFocused(false);
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
    return money(
      (num(item.tempoHoras) * num(valorHoraAplicado) + num(item.valorExtra)) * num(item.quantidade)
    );
  }

  const totalServicos = servicos.reduce((acc, item) => acc + itemSubtotal(item), 0);
  const temOpcoes = focused && options.length > 0;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Wrench size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold text-on-surface">Serviços</h3>
        {valorHoraAplicado ? (
          <span className="ml-auto rounded bg-surface-container-high px-2.5 py-1 text-xs font-semibold text-primary-container">
            Hora: {formatCurrency(valorHoraAplicado)}
          </span>
        ) : null}
      </div>
      {!valorHoraAplicado ? (
        <p className="text-[15px] text-on-surface-variant">
          Configure seus custos em Ajustes para o valor hora calculado. Enquanto isso, use o Valor
          Extra para compor o preço.
        </p>
      ) : null}

      <div className="relative" ref={dropdownRef}>
        <Input
          icon={Search}
          placeholder="Buscar serviço..."
          value={busca}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => setBusca(event.target.value)}
        />
        {temOpcoes ? (
          <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded border border-zinc-border bg-surface-container-high shadow-dewalt-bevel">
            {options.map((nome) => (
              <button
                key={nome}
                type="button"
                onClick={() => addServico(nome)}
                className="flex min-h-[44px] w-full items-center gap-2 px-4 text-left text-[15px] text-on-surface transition-colors hover:bg-primary-container hover:text-on-primary-container"
              >
                <Plus size={16} className="shrink-0 text-primary-container" />
                <span className="min-w-0 truncate">{nome}</span>
              </button>
            ))}
            {avulsoSugerido ? (
              <button
                type="button"
                onClick={() => addServico(termo)}
                className="flex min-h-[44px] w-full items-center gap-2 border-t border-zinc-border px-4 text-left text-[15px] font-bold text-primary-container transition-colors hover:bg-primary-container/10"
              >
                <Plus size={16} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">Adicionar avulso “{termo}”</span>
                <span className="shrink-0 text-[13px] font-semibold text-on-surface-variant">
                  personalizado
                </span>
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            if (!termo) {
              onNotify('Digite o nome do serviço avulso ou escolha da lista acima.');
              return;
            }
            addServico(termo);
          }}
          disabled={!termo}
          className="flex h-14 items-center justify-center gap-2 rounded border border-primary-container/70 text-[15px] font-bold text-primary-container transition-colors hover:bg-primary-container/10 disabled:cursor-not-allowed disabled:opacity-50"
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
          className="flex h-14 items-center justify-center gap-2 rounded bg-secondary-container/10 text-[15px] font-bold text-secondary transition-colors hover:bg-secondary-container/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <BookOpen size={20} />
          Buscar manual
        </button>
      </div>

      {servicos.length > 0 ? (
        servicos.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded border border-zinc-border bg-surface-container p-3"
          >
            <div className="flex items-center gap-3">
              <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-on-surface">
                {item.nome}
              </p>
              <button
                type="button"
                aria-label={`Remover ${item.nome}`}
                onClick={() => removeItem(item.id)}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-error-container/50 text-error transition-colors hover:bg-error/20"
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
                placeholder={privacidade ? 'R$ ***' : '0,00'}
                value={privacidade ? '' : item.valorExtra}
                onChange={(event) => updateItem(item.id, 'valorExtra', event.target.value)}
                disabled={privacidade}
              />
            </div>
            <p className="flex items-center gap-1.5 text-[15px] text-on-surface-variant">
              <X size={14} className="shrink-0 text-primary-container" />
              Subtotal:{' '}
              <span className="font-mono font-bold text-primary-container">
                {formatCurrency(itemSubtotal(item))}
              </span>
            </p>
          </div>
        ))
      ) : (
        <p className="rounded border border-dashed border-zinc-border bg-surface-container/40 px-4 py-6 text-center text-[15px] text-on-surface-variant">
          Nenhum serviço adicionado. Toque na busca para ver os mais utilizados ou use o Avulso.
        </p>
      )}

      {servicos.length > 0 ? (
        <div className="flex items-center justify-between rounded bg-surface-container-high px-4 py-3">
          <span className="text-[15px] font-semibold text-on-surface-variant">Subtotal serviços</span>
          <span className="font-mono text-[15px] font-bold text-primary-container">
            {formatCurrency(totalServicos)}
          </span>
        </div>
      ) : null}
    </section>
  );
}