import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  Trash2,
  Wrench,
  Clock3,
  Coins,
  X,
  ExternalLink,
} from 'lucide-react';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
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

  // Modais: Servico Avulso (nome, quantidade, valor) e Busca de Manual (.pdf)
  const [avulsoOpen, setAvulsoOpen] = useState(false);
  const [avulsoName, setAvulsoName] = useState('');
  const [manualOpen, setManualOpen] = useState(false);
  const [manualNome, setManualNome] = useState('');

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

  function addServicoAvulso({ nome, quantidade, valor }) {
    const nomeFinal = String(nome ?? '').trim();
    if (!nomeFinal) return;
    registrarUso(nomeFinal);
    onChangeServicos((lista) => [
      ...lista,
      {
        id: uid(),
        nome: nomeFinal,
        quantidade: String(quantidade || '1'),
        tempoHoras: '0',
        valorExtra: valor,
      },
    ]);
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

  // Abre o modal de servico avulso (preenchendo o nome quando veio da busca).
  function openAvulsoModal(nomePrefill = '') {
    setAvulsoName(termo || nomePrefill);
    setManualOpen(false);
    setAvulsoOpen(true);
  }

  function buscarManual() {
    const palavras = [
      'manual',
      'de',
      'montagem',
      ...String(manualNome || '').trim().split(/\s+/),
      '.pdf',
    ].filter(Boolean);
    const query = palavras.join('+');
    window.open(
      `https://www.google.com/search?q=${query}`,
      '_blank',
      'noopener,noreferrer'
    );
    setManualOpen(false);
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
                onMouseDown={(event) => {
                  event.preventDefault();
                  setFocused(false);
                  addServico(nome);
                }}
                className="flex min-h-[44px] w-full items-center gap-2 px-4 text-left text-[15px] text-on-surface transition-colors hover:bg-primary-container hover:text-on-primary-container"
              >
                <Plus size={16} className="shrink-0 text-primary-container" />
                <span className="min-w-0 truncate">{nome}</span>
              </button>
            ))}
            {avulsoSugerido ? (
              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  setFocused(false);
                  openAvulsoModal(termo);
                }}
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
          onClick={() => openAvulsoModal()}
          className="flex h-14 items-center justify-center gap-2 rounded border border-primary-container/70 text-[15px] font-bold text-primary-container transition-colors hover:bg-primary-container/10"
        >
          <Plus size={20} />
          Avulso
        </button>
        <button
          type="button"
          onClick={() => setManualOpen(true)}
          className="flex h-14 items-center justify-center gap-2 rounded bg-secondary-container/10 text-[15px] font-bold text-secondary transition-colors hover:bg-secondary-container/20"
        >
          <BookOpen size={20} />
          Buscar Manual
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
                label="Valor (R$)"
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

      {/* Modal: Servico Avulso — nome, quantidade e valor; sem campo de tempo */}
      <ServicoAvulsoModal
        open={avulsoOpen}
        initialName={avulsoName}
        onClose={() => setAvulsoOpen(false)}
        onConfirm={(dados) => {
          addServicoAvulso(dados);
          setAvulsoOpen(false);
        }}
      />

      {/* Modal: Buscar Manual de Montagem (.pdf) */}
      <Modal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        title="Buscar manual de montagem"
      >
        <div className="flex flex-col gap-4">
          <p className="text-[15px] text-on-surface-variant">
            Informe o nome do móvel para localizar o manual em PDF na internet.
          </p>
          <Input
            label="Nome do móvel"
            placeholder="Ex: guarda-roupa, cama box, rack"
            icon={ExternalLink}
            autoFocus
            value={manualNome}
            onChange={(event) => setManualNome(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') buscarManual();
            }}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setManualOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={buscarManual}
              disabled={!manualNome.trim()}
              className="bg-secondary-container/10 text-secondary hover:bg-secondary-container/20"
            >
              <BookOpen size={20} />
              Buscar Manual
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

function ServicoAvulsoModal({ open, initialName, onClose, onConfirm }) {
  const { formatCurrency, privacidade } = useAppData();
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [valor, setValor] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setNome(initialName || '');
      setQuantidade('1');
      setValor('');
      setError('');
    }
  }, [open, initialName]);

  function handleConfirm() {
    if (!nome.trim()) {
      setError('Informe o nome do serviço.');
      return;
    }
    const numeroValor = num(valor);
    if (numeroValor <= 0) {
      setError('Informe o valor do serviço (R$).');
      return;
    }
    const qtd = Math.max(1, num(quantidade) || 1);
    onConfirm({ nome: nome.trim(), quantidade: String(qtd), valor: String(valor) });
  }

  const totalPreview = money(num(valor) * Math.max(1, num(quantidade) || 1));

  return (
    <Modal open={open} onClose={onClose} title="Serviço avulso">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleConfirm();
        }}
        className="flex flex-col gap-4"
      >
        {error ? <Alert tone="error">{error}</Alert> : null}

        <Input
          label="Nome do Serviço *"
          placeholder="Ex: Montagem de poltrona"
          icon={Wrench}
          autoFocus
          value={nome}
          onChange={(event) => {
            setNome(event.target.value);
            setError('');
          }}
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Quantidade"
            inputMode="numeric"
            value={quantidade}
            onChange={(event) =>
              setQuantidade(event.target.value.replace(/[^\d]/g, '') || '1')
            }
          />
          <Input
            label="Valor (R$) *"
            prefix="R$"
            inputMode="decimal"
            placeholder={privacidade ? 'R$ ***' : '0,00'}
            value={privacidade ? '' : valor}
            onChange={(event) => {
              setValor(event.target.value);
              setError('');
            }}
            disabled={privacidade}
          />
        </div>

        <p className="text-[13px] font-semibold text-on-surface-variant">
          Valor total ({num(quantidade) || 1}
          {num(quantidade) && num(quantidade) > 1 ? ' unidades' : ' unidade'}):{' '}
          <span className="font-mono font-bold text-primary-container">
            {formatCurrency(totalPreview)}
          </span>
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Adicionar serviço</Button>
        </div>
      </form>
    </Modal>
  );
}