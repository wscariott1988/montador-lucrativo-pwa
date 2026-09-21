import { useEffect, useMemo, useRef, useState } from 'react';
import { FilePlus2, RotateCcw, FileText, ClipboardCopy, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { computeValorHora } from '../utils/pricing';
import { toISODate } from '../utils/formatters';
import { num, money, gerarNumeroOrcamento, buildBudgetPayload, saveOrcamento, buildWhatsappText } from '../services/budgetService';
import { incrementarOrcamentos } from '../services/analyticsService';
import { generateBudgetPdf } from '../services/pdfService';
import ServicesEditor from '../components/budget/ServicesEditor';
import PartsEditor from '../components/budget/PartsEditor';
import ClientSection from '../components/budget/ClientSection';
import PaymentSection from '../components/budget/PaymentSection';
import DiscountAndTotal from '../components/budget/DiscountAndTotal';
import Toast from '../components/ui/Toast';

export default function NewBudgetView() {
  const { user } = useAuth();
  const uidUser = user?.uid ?? null;
  const { profile, tools, clients } = useAppData();

  // SNAPSHOT: valor hora congelado no momento da criacao do orcamento
  const [valorHoraAplicado, setValorHoraAplicado] = useState(null);
  const frozen = useRef(false);
  useEffect(() => {
    if (!profile || frozen.current) return;
    frozen.current = true;
    const calculado = Number(profile.valorHoraCalculado) > 0
      ? Number(profile.valorHoraCalculado)
      : computeValorHora(profile, tools);
    setValorHoraAplicado(calculado > 0 ? calculado : 0);
  }, [profile, tools]);

  const [numero, setNumero] = useState(() => gerarNumeroOrcamento());

  const [servicos, setServicos] = useState([]);
  const [pecas, setPecas] = useState([]);

  const [clienteBusca, setClienteBusca] = useState('');
  const [clienteSelected, setClienteSelected] = useState(null);
  const [cidade, setCidade] = useState('');
  const [dataServico, setDataServico] = useState(() => toISODate());
  const [validadeDias, setValidadeDias] = useState('7');
  const [deslocamento, setDeslocamento] = useState('');

  const [formaPagamento, setFormaPagamento] = useState('Pix');
  const [condicoes, setCondicoes] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [descontoTipo, setDescontoTipo] = useState('valor');
  const [descontoValor, setDescontoValor] = useState('');

  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Motor de calculo em tempo real
  const resultado = useMemo(() => {
    const totalServicos = servicos.reduce(
      (acc, item) =>
        acc + money((num(item.tempoHoras) * num(valorHoraAplicado) + num(item.valorExtra)) * num(item.quantidade)),
      0
    );
    const totalPecas = pecas.reduce(
      (acc, item) => acc + money(num(item.quantidade) * num(item.valorVendaUnitario)),
      0
    );
    const taxaDeslocamento = num(deslocamento);
    const subtotal = money(totalServicos + totalPecas + taxaDeslocamento);
    const descontoBruto =
      descontoTipo === 'percentual'
        ? subtotal * (num(descontoValor) / 100)
        : num(descontoValor);
    const descontoAplicado = money(Math.min(descontoBruto, subtotal));
    return {
      totalServicos: money(totalServicos),
      totalPecas: money(totalPecas),
      taxaDeslocamento: money(taxaDeslocamento),
      subtotal,
      descontoAplicado,
      totalGeral: money(subtotal - descontoAplicado),
    };
  }, [servicos, pecas, valorHoraAplicado, deslocamento, descontoTipo, descontoValor]);

  const dados = useMemo(
    () =>
      buildBudgetPayload({
        numero,
        clienteSelected,
        clienteBusca,
        cidade: cidade.trim(),
        dataServico,
        validadeDias,
        valorHoraAplicado,
        servicos,
        pecas,
        taxaDeslocamento: resultado.taxaDeslocamento,
        descontoTipo,
        descontoValor,
        subtotal: resultado.subtotal,
        descontoAplicado: resultado.descontoAplicado,
        totalServicos: resultado.totalServicos,
        totalPecas: resultado.totalPecas,
        totalGeral: resultado.totalGeral,
        formaPagamento,
        formasPagamentoAceitas: [formaPagamento],
        condicoesPagamento: condicoes.trim(),
        observacoes: observacoes.trim(),
      }),
    [
      numero,
      clienteSelected,
      clienteBusca,
      cidade,
      dataServico,
      validadeDias,
      valorHoraAplicado,
      servicos,
      pecas,
      resultado,
      descontoTipo,
      descontoValor,
      formaPagamento,
      condicoes,
      observacoes,
    ]
  );

  const temItens = servicos.length > 0 || pecas.length > 0;
  const acoesTravadas = resultado.totalGeral <= 0 || !temItens;

  function resetForm() {
    setServicos([]);
    setPecas([]);
    setClienteBusca('');
    setClienteSelected(null);
    setCidade('');
    setDataServico(toISODate());
    setValidadeDias('7');
    setDeslocamento('');
    setFormaPagamento('Pix');
    setCondicoes('');
    setObservacoes('');
    setDescontoTipo('valor');
    setDescontoValor('');
    setNumero(gerarNumeroOrcamento());
  }

  async function handleWhatsAppCopy() {
    if (acoesTravadas || isSubmitting) return;
    try {
      await navigator.clipboard.writeText(buildWhatsappText(dados));
      setToast({ tone: 'success', message: 'Texto copiado para a área de transferência!' });
    } catch {
      setToast({
        tone: 'error',
        message: 'O navegador bloqueou a cópia. Selecione o texto manualmente.',
      });
    }
  }

  async function handleSave() {
    if (acoesTravadas || isSubmitting) return;
    if (!uidUser) {
      setToast({ tone: 'error', message: 'Faça login para salvar o orçamento.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await saveOrcamento(uidUser, dados);
      await incrementarOrcamentos(uidUser);
      setToast({ tone: 'success', message: 'Orçamento salvo no histórico!' });
      resetForm();
    } catch {
      setToast({
        tone: 'error',
        message: 'Falha ao salvar. Verifique sua conexão e tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handlePdf() {
    if (acoesTravadas || isSubmitting) return;
    try {
      generateBudgetPdf(dados);
    } catch {
      setToast({ tone: 'error', message: 'Não foi possível gerar o PDF.' });
    }
  }

  return (
    <section className="flex flex-col gap-5 pb-8">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FilePlus2 size={20} className="text-primary-container" />
          <h2 className="text-base font-semibold text-on-surface">Novo orçamento</h2>
        </div>
        <button
          type="button"
          onClick={resetForm}
          disabled={isSubmitting}
          className="flex h-14 items-center gap-2 rounded-lg border border-zinc-border px-3 text-[15px] font-semibold text-on-surface-variant transition-colors hover:text-on-surface disabled:opacity-50"
        >
          <RotateCcw size={18} />
          Limpar
        </button>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-surface-container-high px-4 py-3">
        <span className="text-[15px] text-on-surface-variant">Referência</span>
        <span className="font-mono text-[15px] font-bold text-primary-container">#{numero}</span>
      </div>

      <ServicesEditor
        valorHoraAplicado={valorHoraAplicado}
        servicos={servicos}
        onChangeServicos={setServicos}
        onNotify={(msg) => setToast({ tone: 'error', message: msg })}
      />

      <PartsEditor pecas={pecas} onChangePecas={setPecas} onNotify={(msg) => setToast({ tone: 'error', message: msg })} />

      <ClientSection
        clients={clients}
        clienteBusca={clienteBusca}
        onClienteBusca={setClienteBusca}
        clienteSelected={clienteSelected}
        onClienteSelected={setClienteSelected}
        cidade={cidade}
        onCidade={setCidade}
        dataServico={dataServico}
        onDataServico={setDataServico}
        validadeDias={validadeDias}
        onValidade={setValidadeDias}
        deslocamento={deslocamento}
        onDeslocamento={setDeslocamento}
      />

      <PaymentSection
        formaPagamento={formaPagamento}
        onFormaPagamento={setFormaPagamento}
        condicoes={condicoes}
        onCondicoes={setCondicoes}
        observacoes={observacoes}
        onObservacoes={setObservacoes}
      />

      <DiscountAndTotal
        descontoTipo={descontoTipo}
        onDescontoTipo={setDescontoTipo}
        descontoValor={descontoValor}
        onDescontoValor={setDescontoValor}
        totalServicos={resultado.totalServicos}
        totalPecas={resultado.totalPecas}
        taxaDeslocamento={resultado.taxaDeslocamento}
        subtotal={resultado.subtotal}
        descontoAplicado={resultado.descontoAplicado}
        totalGeral={resultado.totalGeral}
        acoesTravadas={acoesTravadas}
      />

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handlePdf}
            disabled={acoesTravadas || isSubmitting}
            className="flex h-14 items-center justify-center gap-2 rounded-lg bg-tertiary/10 text-[15px] font-bold text-tertiary transition-colors hover:bg-tertiary/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText size={20} />
            Gerar PDF
          </button>
          <button
            type="button"
            onClick={handleWhatsAppCopy}
            disabled={acoesTravadas || isSubmitting}
            className="flex h-14 items-center justify-center gap-2 rounded-lg bg-secondary-container/10 text-[15px] font-bold text-secondary transition-colors hover:bg-secondary-container/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ClipboardCopy size={20} />
            WhatsApp
          </button>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={acoesTravadas || isSubmitting}
          className="flex h-14 items-center justify-center gap-2 rounded-lg bg-primary-container text-on-primary-container text-[15px] font-bold shadow-yellow-bevel transition-all hover:bg-primary-fixed active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : (
            <>
              <History size={20} />
              Salvar no histórico
            </>
          )}
        </button>
      </div>

      <Toast
        message={toast?.message}
        tone={toast?.tone}
        onClose={() => setToast(null)}
      />
    </section>
  );
}