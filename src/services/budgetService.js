import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { formatBRL, formatDateBR, addDaysISO } from '../utils/formatters';

export function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function num(value) {
  const n = Number.parseFloat(String(value ?? '').replace(',', '.'));
  return n > 0 ? n : 0;
}

export function money(value) {
  return Math.round((num(value) + Number.EPSILON) * 100) / 100;
}

export function gerarNumeroOrcamento() {
  return `ORC-${Date.now()}`;
}

// Monta o payload canonico do orcamento (usado por PDF, WhatsApp e Firestore)
export function buildBudgetPayload({
  numero,
  clienteSelected,
  clienteBusca,
  cidade,
  dataServico,
  validadeDias,
  valorHoraAplicado,
  servicos,
  pecas,
  taxaDeslocamento,
  descontoTipo,
  descontoValor,
  subtotal,
  descontoAplicado,
  totalServicos,
  totalPecas,
  totalGeral,
  formaPagamento,
  formasPagamentoAceitas,
  condicoesPagamento,
  observacoes,
}) {
  const nomeCliente = String(clienteSelected?.nome || clienteBusca || '').trim();
  const validade = num(validadeDias) || 7;

  const itensServicos = servicos.map((item) => ({
    nome: item.nome,
    tempoHoras: num(item.tempoHoras),
    quantidade: num(item.quantidade),
    valorExtra: num(item.valorExtra),
    subtotal: money(
      (num(item.tempoHoras) * (num(valorHoraAplicado) || 0) + num(item.valorExtra)) *
        num(item.quantidade)
    ),
  }));

  const itensPecas = pecas.map((item) => ({
    nome: item.nome,
    quantidade: num(item.quantidade),
    custoPago: num(item.custoPago ?? 0),
    valorVendaUnitario: num(item.valorVendaUnitario),
    subtotal: money(num(item.quantidade) * num(item.valorVendaUnitario)),
  }));

  return {
    numero,
    clienteId: clienteSelected?.id ?? null,
    clienteNome: nomeCliente,
    cliente: {
      id: clienteSelected?.id ?? null,
      nome: nomeCliente,
      telefone: clienteSelected?.telefone ?? '',
      endereco: clienteSelected?.endereco ?? '',
    },
    endereco: clienteSelected?.endereco ?? '',
    cidade,
    dataServico,
    dataValidade: addDaysISO(validade),
    status: 'pendente',
    validadeDias: validade,
    valorHoraAplicado: num(valorHoraAplicado),
    taxaDeslocamento: money(taxaDeslocamento),
    custoAjudante: 0,
    descontoTipo,
    descontoValor: money(descontoValor),
    descontoPercentual: descontoTipo === 'percentual' ? money(descontoValor) : 0,
    itensServicos,
    itensPecas,
    totalServicos: money(totalServicos),
    totalPecas: money(totalPecas),
    totalGeral: money(totalGeral),
    financas: {
      subtotal: money(subtotal),
      descontoTipo,
      descontoAplicado: money(descontoAplicado),
      totalGeral: money(totalGeral),
    },
    condicoesPagamento,
    formaPagamento,
    formasPagamentoAceitas: formasPagamentoAceitas || [formaPagamento],
    observacoes,
  };
}

export async function saveOrcamento(uid, dados) {
  await addDoc(collection(db, 'users', uid, 'orcamentos'), {
    ...dados,
    // Snapshot congelado do payload: permite refazer o PDF identico depois,
    // sem recalcular precos ou refazer consultas (usado no Historico).
    snapshot: dados,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function buildWhatsappText(dados) {
  const lines = [
    `📋 *ORÇAMENTO DE MONTAGEM*`,
    `Ref. *#${dados.numero}*`,
    ``,
    `👤 Cliente: ${dados.clienteNome || '-'}`,
    dados.cidade ? `📍 Cidade: ${dados.cidade}` : '',
    `📅 Montagem: ${formatDateBR(dados.dataServico)}`,
    ``,
    dados.itensServicos.length ? `🧰 *Serviços:*` : '',
    ...dados.itensServicos.map(
      (item) =>
        `• ${item.nome} (${item.quantidade}x) — ${formatBRL(item.subtotal)}`
    ),
    dados.itensPecas.length ? `🔩 *Peças:*` : '',
    ...dados.itensPecas.map(
      (item) => `• ${item.nome} (${item.quantidade}x) — ${formatBRL(item.subtotal)}`
    ),
    dados.taxaDeslocamento > 0
      ? `🚙 Deslocamento: ${formatBRL(dados.taxaDeslocamento)}`
      : '',
    dados.descontoAplicado > 0
      ? `🏷️ Desconto (${dados.descontoTipo === 'percentual' ? '%' : 'R$'}): -${formatBRL(
          dados.descontoAplicado
        )}`
      : '',
    ``,
    `💰 *TOTAL GERAL: ${formatBRL(dados.totalGeral)}*`,
    `✅ Válido até: ${formatDateBR(dados.dataValidade)}`,
    dados.formaPagamento ? `💳 Forma de pagamento: ${dados.formaPagamento}` : '',
    dados.condicoesPagamento ? `📝 Condições: ${dados.condicoesPagamento}` : '',
  ];
  return lines.filter((line) => line !== '').join('\n');
}