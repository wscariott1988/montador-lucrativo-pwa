import { useState } from 'react';
import { Wrench, Plus, Pencil, Trash2, AlertTriangle, CheckCircle2, CloudOff } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { useAppData } from '../../context/AppDataContext';
import {
  computeDepreciacaoMensal,
  computeCustoMensalFerramentas,
  computePercentualVidaUtil,
} from '../../utils/pricing';
import { parseBRLtoNumber } from '../../utils/formatters';

const EMPTY_FORM = { nome: '', valorCompra: '', vidaUtilMeses: '' };

function moneyToDraft(value) {
  if (value == null) return '';
  return String(Number(value)).replace('.', ',');
}

function ToolForm({ initial, saving, onSubmit, onCancel }) {
  const { privacidade } = useAppData();
  const [form, setForm] = useState(
    initial
      ? {
          nome: initial.nome ?? '',
          valorCompra: moneyToDraft(initial.valorCompra),
          vidaUtilMeses: String(initial.vidaUtilMeses ?? ''),
        }
      : EMPTY_FORM
  );
  const [error, setError] = useState('');

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.nome.trim()) {
      setError('Informe o nome da ferramenta.');
      return;
    }
    const valorCompra = parseBRLtoNumber(form.valorCompra);
    const vidaUtilMeses = Number(form.vidaUtilMeses) || 0;
    if (valorCompra <= 0) {
      setError('Informe o valor de compra.');
      return;
    }
    if (vidaUtilMeses <= 0) {
      setError('Informe a vida útil em meses.');
      return;
    }
    onSubmit({ nome: form.nome, valorCompra, vidaUtilMeses });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? <Alert tone="error">{error}</Alert> : null}

      <Input
        label="Nome da ferramenta *"
        placeholder="Ex: Parafusadeira de impacto 20V"
        icon={Wrench}
        autoFocus
        value={form.nome}
        onChange={(event) => setField('nome', event.target.value)}
      />

      <div className="space-y-2">
        <Input
          label="Valor de compra (R$) *"
          prefix="R$"
          inputMode="decimal"
          placeholder={privacidade ? 'R$ ***' : '0,00'}
          value={privacidade ? '' : form.valorCompra}
          onChange={(event) => setField('valorCompra', event.target.value)}
          disabled={privacidade}
        />
        <Input
          label="Vida útil (meses) *"
          inputMode="numeric"
          placeholder="Ex: 36"
          value={form.vidaUtilMeses}
          onChange={(event) => setField('vidaUtilMeses', event.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving}>
          {initial ? 'Salvar alterações' : 'Adicionar ferramenta'}
        </Button>
      </div>
    </form>
  );
}

export default function ToolsManager() {
  const { tools, online, addTool, updateTool, deleteTool, formatCurrency } = useAppData();
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function openCreate() {
    setModal({ mode: 'create' });
  }

  function openEdit(tool) {
    setModal({ mode: 'edit', tool });
  }

  async function handleSubmit(data) {
    setSaving(true);
    try {
      if (modal?.mode === 'edit') {
        await updateTool(modal.tool.id, data);
      } else {
        await addTool(data);
      }
      setModal(null);
      setFeedback(
        online
          ? 'Ferramenta salva no Firebase.'
          : 'Ferramenta salva no aparelho — sincroniza ao reconectar.'
      );
    } catch {
      setFeedback('Falha ao salvar a ferramenta. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(tool) {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Remover "${tool.nome}"? Essa ação não pode ser desfeita.`)) return;
    deleteTool(tool.id).catch(() => setFeedback('Falha ao remover a ferramenta.'));
  }

  const totalDepreciacao = computeCustoMensalFerramentas(tools);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench size={20} className="text-primary-container" />
          <h3 className="text-base font-semibold tracking-wide text-on-surface">
            Gerenciar ferramentas
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-surface-container-high px-2.5 py-1 text-xs font-semibold text-primary-container">
            {tools.length} {tools.length === 1 ? 'item' : 'itens'}
          </span>
          <button
            type="button"
            onClick={openCreate}
            className="flex h-11 items-center gap-1.5 rounded-lg bg-primary-container px-3 text-[15px] font-bold text-on-primary-container shadow-yellow-bevel transition-all active:translate-y-0.5 active:shadow-none"
          >
            <Plus size={20} strokeWidth={2.5} />
            Adicionar
          </button>
        </div>
      </div>

      {feedback ? (
        <p
          className={`flex items-center gap-2 text-[15px] font-semibold ${
            feedback.startsWith('Falha') ? 'text-error' : 'text-primary-container'
          }`}
        >
          {feedback.startsWith('Falha') ? null : feedback.includes('aparelho') ? (
            <CloudOff size={18} className="shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="shrink-0" />
          )}
          {feedback}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        {tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded border border-dashed border-zinc-border bg-surface-container/40 px-6 py-8 text-center">
            <Wrench size={26} className="text-on-surface-variant" />
            <p className="text-[15px] font-normal text-on-surface-variant">
              Nenhuma ferramenta cadastrada ainda. Toque em Adicionar para começar.
            </p>
          </div>
        ) : (
          tools.map((tool) => {
            const percentual = computePercentualVidaUtil(tool);
            const esgotada = percentual >= 100;
            const resta = Math.max(0, 100 - percentual);
            return (
              <div
                key={tool.id}
                className={`flex flex-col gap-3 rounded border bg-surface-container p-3 ${
                  esgotada ? 'border-error/60' : 'border-zinc-border'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface-container-highest ${
                        esgotada ? 'text-error' : 'text-primary-container'
                      }`}
                    >
                      <Wrench size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold text-on-surface">
                        {tool.nome}
                      </p>
                      <p className="mt-0.5 text-[15px] font-normal text-on-surface-variant">
                        Compra:{' '}
                        <span className="font-mono font-bold text-on-surface">
                          {formatCurrency(tool.valorCompra)}
                        </span>{' '}
                        • {tool.vidaUtilMeses} meses
                      </p>
                      {esgotada ? (
                        <p className="mt-1 flex items-center gap-1 text-[13px] font-bold text-error">
                          <AlertTriangle size={14} className="shrink-0" />
                          Vida útil esgotada — reavalie esta ferramenta
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Editar ${tool.nome}`}
                      onClick={() => openEdit(tool)}
                      className="flex h-10 w-10 items-center justify-center rounded bg-surface-container-high text-on-surface-variant transition-colors hover:text-on-surface"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remover ${tool.nome}`}
                      onClick={() => confirmDelete(tool)}
                      className="flex h-10 w-10 items-center justify-center rounded bg-error-container/50 text-error transition-colors hover:bg-error/20"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {percentual > 0 ? (
                  <div className="flex flex-col gap-1">
                    <div className="h-1.5 w-full overflow-hidden rounded bg-surface-container-highest">
                      <div
                        className={`h-full rounded transition-all ${
                          esgotada ? 'bg-error' : 'bg-primary-container'
                        }`}
                        style={{ width: `${Math.min(100, percentual)}%` }}
                      />
                    </div>
                    <span
                      className={`text-[13px] font-semibold ${
                        esgotada ? 'text-error' : 'text-on-surface-variant'
                      }`}
                    >
                      {esgotada
                        ? 'Vida útil consumida ≥ 100%'
                        : `${resta}% de vida útil restante`}
                    </span>
                  </div>
                ) : null}

                <div className="flex items-center justify-between rounded bg-surface-container-low px-3 py-2">
                  <span className="text-[15px] font-normal text-on-surface-variant">
                    Depreciação mensal (Valor / Meses)
                  </span>
                  <span className="font-mono text-[15px] font-bold text-primary-container">
                    {formatCurrency(
                      tool.depreciacaoMensal != null
                        ? tool.depreciacaoMensal
                        : computeDepreciacaoMensal(tool.valorCompra, tool.vidaUtilMeses)
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {tools.length > 0 ? (
        <div className="flex items-center justify-between rounded bg-surface-container-high px-4 py-3">
          <span className="text-[15px] font-semibold text-on-surface-variant">
            Depreciação total / mês
          </span>
          <span className="font-mono text-[15px] font-bold text-tertiary">
            {formatCurrency(totalDepreciacao)}
          </span>
        </div>
      ) : null}

      <Modal
        open={modal != null}
        onClose={() => {
          if (!saving) setModal(null);
        }}
        title={modal?.mode === 'edit' ? 'Editar ferramenta' : 'Adicionar ferramenta'}
      >
        <ToolForm
          initial={modal?.mode === 'edit' ? modal.tool : null}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={() => setModal(null)}
        />
      </Modal>
    </section>
  );
}