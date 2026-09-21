// Calculos e formatacao do modulo de orcamentos (Fase 5 - Motor de Vendas).
import { formatBRL, parseBRLtoNumber } from './formatters';

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

// Id local de item de lista (servicos/pecas) — unico na sessao.
export function gerarIdItem() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `item_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// Aceita texto ("1.234,56"), numero ou string numerica.
function parseMoney(value) {
  if (typeof value === 'string' && value.trim() !== '') {
    return parseBRLtoNumber(value);
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

// Preco de um servico = ((tempoHoras * ValorHoraCalculado) + valorExtra) * quantidade
export function calcularServico(item, valorHora) {
  const horas = toNumber(item.tempoHoras);
  const extra = parseMoney(item.valorExtra);
  const quantidade = toNumber(item.quantidade);
  const precoUnitario = horas * toNumber(valorHora) + extra;
  return round2(precoUnitario * quantidade);
}

// Preco de uma peca = quantidade * valorUnitario
export function calcularPeca(item) {
  const quantidade = toNumber(item.quantidade);
  const valorUnitario = parseMoney(item.valorUnitario ?? item.valorVendaUnitario);
  return round2(quantidade * valorUnitario);
}

// Total Geral = (Servicos + Pecas + Deslocamento) * (1 - desconto% / 100)
export function calcularTotais({ servicos, pecas, deslocamento, descontoPercentual, valorHora }) {
  const listServicos = Array.isArray(servicos) ? servicos : [];
  const listPecas = Array.isArray(pecas) ? pecas : [];

  const totalServicos = round2(listServicos.reduce((acc, item) => acc + calcularServico(item, valorHora), 0));
  const totalPecas = round2(listPecas.reduce((acc, item) => acc + calcularPeca(item), 0));
  const deslocamentoValue = round2(parseMoney(deslocamento));

  const desconto = Math.min(100, Math.max(0, toNumber(descontoPercentual)));
  const bruto = totalServicos + totalPecas + deslocamentoValue;
  const descontoValor = round2(bruto * (desconto / 100));
  const totalGeral = round2(bruto - descontoValor);

  return {
    totalServicos,
    totalPecas,
    deslocamento: deslocamentoValue,
    descontoPercentual: desconto,
    descontoValor,
    totalGeral,
  };
}

// Data de vencimento da proposta = emissao + dias de validade (padrao 7).
export function dataValidade(dataBase = new Date(), validadeDias = 7) {
  const dias = Math.max(1, toNumber(validadeDias) || 7);
  const date = dataBase ? new Date(dataBase) : new Date();
  date.setDate(date.getDate() + dias);
  return date;
}

export function formatDataPTBR(date) {
  return date.toLocaleDateString('pt-BR');
}

function linhaServico(item) {
  const qtd = toNumber(item.quantidade);
  const horas = toNumber(item.tempoHoras);
  const nome = String(item.nome ?? '').trim() || 'Serviço avulso';
  const detalhe = qtd > 1 ? `${qtd}x` : '';
  const horasTxt = horas > 0 ? `~${horas}h` : '';
  const fatias = [nome, `${detalhe} ${horasTxt}`.trim()].filter(Boolean).join(' ');
  return `• ${fatias} — ${formatBRL(item.subtotal)}`;
}

function linhaPeca(item) {
  const qtd = toNumber(item.quantidade);
  const nome = String(item.nome ?? '').trim() || 'Peça';
  const unit = formatBRL(item.valorVendaUnitario ?? item.valorUnitario);
  return `• ${nome} ${qtd > 1 ? `${qtd}x` : ''} (${unit}) — ${formatBRL(item.subtotal)}`;
}

// Mensagem elegante para copiar e colar no WhatsApp do cliente.
export function montarMensagemWhatsApp({
  numeroOrcamento,
  clienteNome = '',
  cidade = '',
  dataServico = '',
  validadeDias = 7,
  itensServicos = [],
  itensPecas = [],
  formas = [],
  condicoes = '',
  observacoes = '',
  totais,
  valorHora = 0,
}) {
  const t = totais;
  const validade = dataValidade(new Date(), validadeDias);
  const linhas = [];
  const saudacao = clienteNome ? `, ${clienteNome}` : '';

  linhas.push(`🛠️ *ORÇAMENTO ${numeroOrcamento}*`);
  linhas.push('');
  linhas.push(`Olá${saudacao}! Segue a proposta para a montagem:`);
  linhas.push('');

  if (cidade) linhas.push(`📍 *Cidade:* ${cidade}`);
  if (dataServico) linhas.push(`📅 *Data da montagem:* ${formatDataPTBR(new Date(`${dataServico}T00:00:00`))}`);
  linhas.push('');

  if (itensServicos.length > 0) {
    linhas.push('🔧 *SERVIÇOS*');
    itensServicos.forEach((item) => linhas.push(linhaServico(item)));
    linhas.push('');
  }

  if (itensPecas.length > 0) {
    linhas.push('🧩 *PEÇAS E ACESSÓRIOS*');
    itensPecas.forEach((item) => linhas.push(linhaPeca(item)));
    linhas.push('');
  }

  if (t.deslocamento > 0) {
    linhas.push(`🚗 *Deslocamento:* ${formatBRL(t.deslocamento)}`);
  }
  linhas.push(`💰 *Total: ${formatBRL(t.totalGeral)}*`);

  if (t.descontoPercentual > 0) {
    linhas.push(`   (Desconto de ${t.descontoPercentual}% — ${formatBRL(t.descontoValor)})`);
  }
  linhas.push('');

  if (formas.length > 0) {
    linhas.push(`💳 *Formas de pagamento:* ${formas.join(', ')}`);
  }
  if (condicoes.trim()) {
    linhas.push(`📌 *Condições:* ${condicoes.trim()}`);
  }
  if (observacoes.trim()) {
    linhas.push(`📝 *Observações:* ${observacoes.trim()}`);
  }
  linhas.push('');

  linhas.push(`✅ Proposta válida até *${formatDataPTBR(validade)}*.`);
  linhas.push('Qualquer dúvida, estou à disposição!');

  return linhas.join('\n');
}