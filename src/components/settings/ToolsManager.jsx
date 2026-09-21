import { useState } from 'react';
import { Wrench, Plus, Check, X, Pencil, Trash2 } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAppData } from '../../context/AppDataContext';
import { computeDepreciacaoMensal, computeCustoMensalFerramentas } from '../../utils/pricing';
import { formatBRL, parseBRLtoNumber } from '../../utils/formatters';

const EMPTY_FORM = { nome: '', valorCompra: '', vidaUtilMeses: '' };

function moneyToDraft(value) {
  if (value == null) return '';
  return String(Number(value)).replace('.', ',');
}

export default function ToolsManager() {
  const { tools, online, addTool, updateTool, deleteTool } = useAppData();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setMsg('');
  }

  function startEdit(tool) {
    setEditingId(tool.id);
    setForm({
      nome: tool.nome ?? '',
      valorCompra: moneyToDraft(tool.valorCompra),
      vidaUtilMeses: String(tool.vidaUtilMeses ?? ''),
    });
    setMsg('');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMsg('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.nome.trim()) {
      setMsg('Informe o nome da ferramenta.');
      return;
    }
    const valorCompra = parseBRLtoNumber(form.valorCompra);
    const vidaUtilMeses = Number(form.vidaUtilMeses) || 0;
    if (valorCompra <= 0) {
      setMsg('Informe o valor de compra.');
      return;
    }
    if (vidaUtilMeses <= 0) {
      setMsg('Informe a vida útil em meses.');
      return;
    }

    try {
      if (editingId) {
        await updateTool(editingId, { nome: form.nome, valorCompra, vidaUtilMeses });
      } else {
        await addTool({ nome: form.nome, valorCompra, vidaUtilMeses });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setMsg(
        online
          ? 'Ferramenta salva no Firebase.'
          : 'Ferramenta salva no aparelho — sincroniza ao reconectar.'
      );
    } catch {
      setMsg('Falha ao salvar a ferramenta. Tente novamente.');
    }
  }

  function confirmDelete(tool) {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Remover "${tool.nome}"? Essa ação não pode ser desfeita.`)) return;
    deleteTool(tool.id).catch(() => setMsg('Falha ao remover a ferramenta.'));
  }

  const totalDepreciacao = computeCustoMensalFerramentas(tools);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench size={20} className="text-primary-container" />
          <h3 className="text-base font-semibold tracking-wide text-on-surface">
            Gestão de ferramentas
          </h3>
        </div>
        <span className="rounded-lg bg-surface-container-high px-2.5 py-1 text-xs font-semibold text-primary-container">
          {tools.length} {tools.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-zinc-border bg-surface-container p-4"
      >
        <Input
          label="Nome da ferramenta"
          placeholder="Ex: Parafusadeira de impacto 20V"
          icon={Wrench}
          value={form.nome}
          onChange={(event) => setField('nome', event.target.value)}
        />

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              label="Valor (R$)"
              prefix="R$"
              inputMode="decimal"
              placeholder="0,00"
              value={form.valorCompra}
              onChange={(event) => setField('valorCompra', event.target.value)}
            />
          </div>
          <div className="w-24 shrink-0">
            <Input
              label="Vida útil"
              inputMode="numeric"
              placeholder="Meses"
              value={form.vidaUtilMeses}
              onChange={(event) => setField('vidaUtilMeses', event.target.value)}
            />
          </div>
          {editingId ? (
            <div className="flex shrink-0 gap-2 pb-0.5">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="h-12 w-14 px-0"
                aria-label="Salvar ferramenta"
              >
                <Check size={22} />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="h-12 w-14 px-0"
                aria-label="Cancelar edição"
                onClick={cancelEdit}
              >
                <X size={22} />
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="h-12 w-14 shrink-0 px-0 pb-0.5"
              aria-label="Adicionar ferramenta"
            >
              <Plus size={24} strokeWidth={2.5} />
            </Button>
          )}
        </div>

        {msg ? (
          <p className="text-[15px] font-semibold text-primary-container">{msg}</p>
        ) : null}
      </form>

      <div className="flex flex-col gap-3">
        {tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-border bg-surface-container/40 px-6 py-8 text-center">
            <Wrench size={26} className="text-on-surface-variant" />
            <p className="text-[15px] font-normal text-on-surface-variant">
              Nenhuma ferramenta cadastrada ainda. Adicione a primeira acima.
            </p>
          </div>
        ) : (
          tools.map((tool) => (
            <div
              key={tool.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-border bg-surface-container p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-highest text-primary-container">
                    <Wrench size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-on-surface">
                      {tool.nome}
                    </p>
                    <p className="mt-0.5 text-[15px] font-normal text-on-surface-variant">
                      Compra:{' '}
                      <span className="font-mono font-bold text-on-surface">
                        {formatBRL(tool.valorCompra)}
                      </span>{' '}
                      • {tool.vidaUtilMeses} meses
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Editar ${tool.nome}`}
                    onClick={() => startEdit(tool)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remover ${tool.nome}`}
                    onClick={() => confirmDelete(tool)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-error-container/50 text-error transition-colors hover:bg-error/20"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2">
                <span className="text-[15px] font-normal text-on-surface-variant">
                  Depreciação mensal
                </span>
                <span className="font-mono text-[15px] font-bold text-primary-container">
                  {formatBRL(
                    tool.depreciacaoMensal != null
                      ? tool.depreciacaoMensal
                      : computeDepreciacaoMensal(tool.valorCompra, tool.vidaUtilMeses)
                  )}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {tools.length > 0 ? (
        <div className="flex items-center justify-between rounded-xl bg-surface-container-high px-4 py-3">
          <span className="text-[15px] font-semibold text-on-surface-variant">
            Depreciação total / mês
          </span>
          <span className="font-mono text-[15px] font-bold text-tertiary">
            {formatBRL(totalDepreciacao)}
          </span>
        </div>
      ) : null}
    </section>
  );
}