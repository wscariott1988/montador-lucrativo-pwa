// Gerador de PDF mobile-first para orcamentos (jspdf + jspdf-autotable).
// Pagina vertical 108mm x 192mm, corpo >= 12pt e Total em destaque amarelo DeWalt.
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { formatBRL, formatPhoneDisplayBR } from '../../utils/formatters';
import { dataValidade, formatDataPTBR, toNumber } from '../../utils/budget';

const YELLOW = [255, 194, 0]; // DeWalt #FFC200
const YELLOW_DEEP = [254, 184, 0]; // #FEB800 (acentos)
const DARK = [18, 18, 20]; // zinc-dark
const CARD = [28, 29, 34]; // surface-container
const BORDER = [46, 48, 56];
const MUTED = [148, 163, 184];
const WHITE = [248, 250, 252];

const PAGE_W = 108;
const PAGE_H = 192;
const MARGIN_X = 8;
const PAGE_BOTTOM = 10;

function novaPagina(doc) {
  doc.addPage([PAGE_W, PAGE_H], 'portrait');
  return MARGIN_X;
}

// Redesenhador de rodape a cada pagina.
function rodape(doc, numeroOrcamento, validade) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...[108, 117, 125]);
    doc.text(
      `${numeroOrcamento}  •  Proposta válida até ${formatDataPTBR(validade)}`,
      MARGIN_X,
      PAGE_H - 5
    );
  }
  doc.setPage(doc.getNumberOfPages());
}

function cabecalho(doc, numeroOrcamento, nomeEmpresa) {
  // Faixa preta com acento amarelo
  doc.setFillColor(...DARK);
  doc.rect(0, 0, PAGE_W, 30, 'F');
  doc.setFillColor(...YELLOW);
  doc.rect(0, 0, 4, 30, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...WHITE);
  doc.text('Montador Lucrativo', 12, 13);

  if (nomeEmpresa) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(...MUTED);
    doc.text(nomeEmpresa, 12, 20);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...YELLOW);
  doc.text(numeroOrcamento, PAGE_W - MARGIN_X, 13, { align: 'right' });

  doc.setTextColor(...WHITE);
  doc.setFontSize(18);
  doc.text('PROPOSTA DE ORÇAMENTO', MARGIN_X, 44);
  doc.setDrawColor(...YELLOW_DEEP);
  doc.setLineWidth(0.8);
  doc.line(MARGIN_X, 47.5, PAGE_W - MARGIN_X, 47.5);
}

function blocoCliente(doc, y, dados) {
  const largura = PAGE_W - MARGIN_X * 2;
  const base = 8.5; // altura base de cada linha
  let linhas = 1;
  if (dados.clienteTelefone) linhas += 1;
  if (dados.cidade) linhas += 1;
  let altura = 16 + base * Math.max(1, linhas);

  doc.setFillColor(...CARD);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(MARGIN_X, y, largura, altura, 2, 2, 'FD');
  doc.setTextColor(...MUTED);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DADOS DO CLIENTE', MARGIN_X + 5, y + 6);

  doc.setTextColor(...WHITE);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(dados.clienteNome || 'Cliente', MARGIN_X + 5, y + 12.5);
  doc.setFont('helvetica', 'normal');
  if (dados.clienteTelefone) {
    doc.text(`Tel: ${dados.clienteTelefone}`, MARGIN_X + 5, y + 20.5);
  }
  if (dados.cidade) {
    doc.text(`Cidade: ${dados.cidade}`, MARGIN_X + 5, y + 28.5);
  }
  return y + altura + 4;
}

function blocoDatas(doc, y, dados) {
  const metade = (PAGE_W - MARGIN_X * 2 - 4) / 2;
  const altura = 15;
  doc.setFillColor(...CARD);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(MARGIN_X, y, PAGE_W - MARGIN_X * 2, altura, 2, 2, 'FD');

  doc.setTextColor(...MUTED);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('MONTAGEM', MARGIN_X + 5, y + 5);
  doc.text('VALIDADE', MARGIN_X + 5 + metade + 4, y + 5);

  doc.setTextColor(...WHITE);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(dados.dataServico, MARGIN_X + 5, y + 12);
  doc.text(`até ${formatDataPTBR(dados.validade)}`, MARGIN_X + 5 + metade + 4, y + 12);

  return y + altura + 5;
}

function tabela(doc, y, titulo, head, body) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...WHITE);
  doc.text(titulo, MARGIN_X, y + 4);

  autoTable(doc, {
    startY: y + 6,
    margin: { left: MARGIN_X, right: MARGIN_X, bottom: PAGE_BOTTOM },
    head: [head],
    body,
    theme: 'striped',
    styles: {
      font: 'helvetica',
      fontSize: 12,
      textColor: WHITE,
      cellPadding: 1.6,
      lineColor: BORDER,
      lineWidth: 0.15,
      valign: 'middle',
    },
    headStyles: {
      fillColor: YELLOW,
      textColor: DARK,
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: CARD },
    columnStyles: {
      0: { cellWidth: 'auto' },
    },
  });
  return doc.lastAutoTable.finalY;
}

function blocoPagamento(doc, y, dados) {
  let cursor = y;
  if (dados.formas.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...WHITE);
    doc.text('PAGAMENTO', MARGIN_X, cursor + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    doc.text(dados.formas.join(' • '), MARGIN_X, cursor + 13);
    cursor += 17;
  }
  if (dados.condicoes.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...WHITE);
    doc.text('CONDIÇÕES', MARGIN_X, cursor + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    doc.text(dados.condicoes.trim(), MARGIN_X, cursor + 13);
    cursor += 17;
  }
  return cursor;
}

function blocoObservacoes(doc, y, observacoes) {
  if (!String(observacoes ?? '').trim()) return y;
  const usoLargura = PAGE_W - MARGIN_X * 2 - 10;
  const linhas = doc.splitTextToSize(String(observacoes).trim(), usoLargura);
  const altura = 12 + linhas.length * 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...WHITE);
  doc.text('OBSERVAÇÕES', MARGIN_X, y + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...MUTED);
  linhas.forEach((linha, index) => {
    doc.text(linha, MARGIN_X, y + 13 + index * 5.2);
  });
  return y + altura + 3;
}

function blocoTotais(doc, y, totais, dados) {
  let cursor = y;

  const linhasTotais = [];
  if (totais.deslocamento > 0) linhasTotais.push(['Deslocamento', formatBRL(totais.deslocamento)]);
  linhasTotais.push(['Subtotal Serviços', formatBRL(totais.totalServicos)]);
  linhasTotais.push(['Subtotal Peças', formatBRL(totais.totalPecas)]);
  if (totais.descontoPercentual > 0) {
    linhasTotais.push([`Desconto (${totais.descontoPercentual}%)`, `- ${formatBRL(totais.descontoValor)}`]);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...WHITE);
  doc.text('RESUMO', MARGIN_X, cursor + 4);
  cursor += 9;

  linhasTotais.forEach((linha) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(...MUTED);
    doc.text(linha[0], MARGIN_X + 2, cursor);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(linha[1], PAGE_W - MARGIN_X - 2, cursor, { align: 'right' });
    cursor += 6.5;
  });
  cursor += 2;

  // Caixa do Total Geral em amarelo DeWalt com texto escuro e 18pt.
  const caixaAltura = 16;
  doc.setFillColor(...YELLOW);
  doc.roundedRect(MARGIN_X, cursor, PAGE_W - MARGIN_X * 2, caixaAltura, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...DARK);
  doc.text('TOTAL GERAL', MARGIN_X + 5, cursor + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(formatBRL(totais.totalGeral), MARGIN_X + 5, cursor + 13);

  return {
    finalY: cursor + caixaAltura,
    caixaLinha: cursor,
  };
}

export function gerarPdfOrcamento({
  numeroOrcamento,
  nomeEmpresa = '',
  clienteNome = '',
  clienteTelefone = '',
  cidade = '',
  dataServico,
  validadeDias = 7,
  itensServicos = [],
  itensPecas = [],
  formas = [],
  condicoes = '',
  observacoes = '',
  totais,
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [PAGE_W, PAGE_H] });
  const validade = dataValidade(new Date(), validadeDias);
  const dataServicoTxt =
    dataServico && /^\d{4}-\d{2}-\d{2}/.test(dataServico)
      ? formatDataPTBR(new Date(`${dataServico}T00:00:00`))
      : dataServico;

  const dados = {
    clienteNome,
    clienteTelefone: clienteTelefone ? formatPhoneDisplayBR(clienteTelefone) : '',
    cidade,
    dataServico: dataServicoTxt,
    validade,
    formas,
    condicoes,
  };

  cabecalho(doc, numeroOrcamento, nomeEmpresa);

  let y = 55;
  y = blocoCliente(doc, y, dados);
  y = blocoDatas(doc, y, dados);

  if (itensServicos.length > 0) {
    const body = itensServicos.map((item) => [
      item.nome,
      String(toNumber(item.tempoHoras)),
      String(toNumber(item.quantidade)),
      formatBRL(item.subtotal),
    ]);
    y = tabela(doc, y, 'SERVIÇOS', ['Serviço', 'Horas', 'Qtd', 'Total'], body);
    y += 6;
  }

  if (itensPecas.length > 0) {
    const body = itensPecas.map((item) => [
      item.nome,
      String(toNumber(item.quantidade)),
      formatBRL(item.valorVendaUnitario ?? item.valorUnitario),
      formatBRL(item.subtotal),
    ]);
    y = tabela(doc, y, 'PEÇAS E ACESSÓRIOS', ['Peça', 'Qtd', 'Unit', 'Total'], body);
    y += 6;
  }

  y = blocoPagamento(doc, y, dados);
  y = blocoObservacoes(doc, y, observacoes);

  const { finalY } = blocoTotais(doc, y, totais, dados);

  // Pagina extra quando o conteudo estoura a base vertical do mobile.
  if (finalY > PAGE_H - PAGE_BOTTOM) {
    const y2 = novaPagina(doc);
    blocoTotais(doc, y2, totais, dados);
  }

  rodape(doc, numeroOrcamento, validade);
  doc.save(`${numeroOrcamento}.pdf`);
}