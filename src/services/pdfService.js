import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatBRL, formatDateBR } from '../utils/formatters';

const YELLOW = [255, 194, 0];
const YELLOW_DEEP = [254, 184, 0];
const DARK = [18, 18, 20];
const CARD = [28, 29, 34];
const BORDER = [46, 48, 56];
const MUTED = [148, 163, 184];
const WHITE = [248, 250, 252];
const TEXTO = [28, 28, 32];

const PAGE_W = 108;
const PAGE_H = 192;
const MARGIN_X = 8;
const PAGE_BOTTOM = 10;

function novaPagina(doc) {
  doc.addPage([PAGE_W, PAGE_H], 'portrait');
  return MARGIN_X;
}

function rodape(doc, numeroOrcamento, validade) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    doc.text(
      `${numeroOrcamento}  •  Proposta válida até ${formatDateBR(validade)}`,
      MARGIN_X,
      PAGE_H - 5
    );
  }
  doc.setPage(doc.getNumberOfPages());
}

function cabecalho(doc, numeroOrcamento, negocio) {
  const nomeEmpresa = negocio?.nome || 'Montador Lucrativo';
  const documento = negocio?.documento || '';
  const cidade = negocio?.cidade || '';

  doc.setFillColor(...DARK);
  doc.rect(0, 0, PAGE_W, 30, 'F');
  doc.setFillColor(...YELLOW);
  doc.rect(0, 0, 4, 30, 'F');

  // Logotipo registrado (se carregado) — falha silenciosa nao derruba o PDF.
  const logoUrl = negocio?.logoUrl || '';
  const temLogo = Boolean(logoUrl);
  if (temLogo) {
    try {
      const isPng = /png/i.test(logoUrl.toLowerCase());
      doc.addImage(logoUrl, isPng ? 'PNG' : 'JPEG', 6, 7, 16, 16);
    } catch {
      // Logotipo indisponivel: segue sem imagem.
    }
  }

  const nomeX = temLogo ? 26 : 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...WHITE);
  doc.text(nomeEmpresa, nomeX, 13);

  const linha2 = [documento, cidade].filter(Boolean).join('  •  ');
  if (linha2) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    doc.text(linha2, nomeX, 21);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...YELLOW);
  doc.text(numeroOrcamento, PAGE_W - MARGIN_X, 13, { align: 'right' });

  if (temLogo) {
    doc.setStrokeColor(...YELLOW);
    doc.setLineWidth(0.5);
    doc.line(nomeX, 25, PAGE_W - MARGIN_X, 25);
  }

  doc.setTextColor(...WHITE);
  doc.setFontSize(18);
  doc.text('PROPOSTA DE ORÇAMENTO', MARGIN_X, 44);
  doc.setDrawColor(...YELLOW_DEEP);
  doc.setLineWidth(0.8);
  doc.line(MARGIN_X, 47.5, PAGE_W - MARGIN_X, 47.5);
}

function blocoCliente(doc, y, dados) {
  const largura = PAGE_W - MARGIN_X * 2;
  const base = 8.5;
  let linhas = 1;
  const telefone = dados.clienteTelefone || '';
  if (telefone) linhas += 1;
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
  if (telefone) {
    doc.text(`Tel: ${telefone}`, MARGIN_X + 5, y + 20.5);
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
  doc.text(`até ${formatDateBR(dados.dataValidade)}`, MARGIN_X + 5 + metade + 4, y + 12);

  return y + altura + 5;
}

function tabela(doc, y, titulo, head, body, columnStyles) {
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
      textColor: TEXTO,
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: CARD },
    columnStyles: columnStyles || { 0: { cellWidth: 'auto' } },
  });
  return doc.lastAutoTable.finalY;
}

function blocoPagamento(doc, y, dados) {
  let cursor = y;
  const formas = dados.formas || [];
  const condicoes = dados.condicoes || '';
  if (formas.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...WHITE);
    doc.text('PAGAMENTO', MARGIN_X, cursor + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    doc.text(formas.join(' • '), MARGIN_X, cursor + 13);
    cursor += 17;
  }
  if (String(condicoes).trim()) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...WHITE);
    doc.text('CONDIÇÕES', MARGIN_X, cursor + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    doc.text(String(condicoes).trim(), MARGIN_X, cursor + 13);
    cursor += 17;
  }
  return cursor;
}

function blocoObservacoes(doc, y, observacoes) {
  const texto = String(observacoes ?? '').trim();
  if (!texto) return y;
  const usoLargura = PAGE_W - MARGIN_X * 2 - 10;
  const linhas = doc.splitTextToSize(texto, usoLargura);
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

function blocoTotais(doc, y, totais) {
  let cursor = y;

  const linhasTotais = [];
  if (totais.deslocamento > 0) linhasTotais.push(['Deslocamento', formatBRL(totais.deslocamento)]);
  linhasTotais.push(['Subtotal Serviços', formatBRL(totais.totalServicos)]);
  linhasTotais.push(['Subtotal Peças', formatBRL(totais.totalPecas)]);
  if (totais.desconto > 0) {
    linhasTotais.push(['Desconto', `- ${formatBRL(totais.desconto)}`]);
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

  return cursor + caixaAltura;
}

export function generateBudgetPdf(dados, negocio = {}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [PAGE_W, PAGE_H] });

  const telefone = dados.cliente?.telefone || '';
  const clienteTelefone = telefone || '';

  const formas = [
    ...(dados.formasPagamentoAceitas || []),
    ...(dados.formaPagamento ? [dados.formaPagamento] : []),
  ].filter(Boolean);
  const formasUnicas = [...new Set(formas)];

  const dadosCliente = {
    clienteNome: dados.clienteNome || '',
    clienteTelefone,
    cidade: dados.cidade || '',
    dataServico: dados.dataServico ? formatDateBR(dados.dataServico) : '',
    dataValidade: dados.dataValidade || '',
    formas: formasUnicas,
    condicoes: dados.condicoesPagamento || '',
  };

  cabecalho(doc, dados.numero || 'ORÇAMENTO', negocio);

  let y = 55;
  y = blocoCliente(doc, y, dadosCliente);
  y = blocoDatas(doc, y, dadosCliente);

  const totais = {
    totalServicos: Number(dados.totalServicos) || 0,
    totalPecas: Number(dados.totalPecas) || 0,
    deslocamento: Number(dados.taxaDeslocamento) || 0,
    desconto: Number(dados.descontoAplicado) || 0,
    totalGeral: Number(dados.totalGeral) || 0,
  };

  if (Array.isArray(dados.itensServicos) && dados.itensServicos.length > 0) {
    const body = dados.itensServicos.map((item) => {
      const qtd = Math.max(1, Number(item.quantidade) || 1);
      const unit = Number(item.subtotal) > 0 ? Number(item.subtotal) / qtd : 0;
      return [String(item.nome ?? '').trim() || 'Serviço', String(item.quantidade ?? '1'), formatBRL(unit), formatBRL(item.subtotal)];
    });
    y = tabela(
      doc,
      y,
      'SERVIÇOS',
      ['Serviço', 'Qtd', 'Unit', 'Total'],
      body,
      {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 20, halign: 'right' },
        3: { cellWidth: 22, halign: 'right' },
      }
    );
    y += 5;
  }

  if (Array.isArray(dados.itensPecas) && dados.itensPecas.length > 0) {
    const body = dados.itensPecas.map((item) => [
      String(item.nome ?? '').trim() || 'Peça',
      String(item.quantidade ?? '1'),
      formatBRL(item.valorVendaUnitario ?? item.valorUnitario ?? 0),
      formatBRL(item.subtotal),
    ]);
    y = tabela(
      doc,
      y,
      'PEÇAS E ACESSÓRIOS',
      ['Peça', 'Qtd', 'Unit', 'Total'],
      body,
      {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 20, halign: 'right' },
        3: { cellWidth: 22, halign: 'right' },
      }
    );
    y += 6;
  }

  if (!(Array.isArray(dados.itensServicos) && dados.itensServicos.length) &&
      !(Array.isArray(dados.itensPecas) && dados.itensPecas.length)) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(...MUTED);
    doc.text('Sem itens detalhados neste orçamento.', MARGIN_X, y + 5);
    y += 12;
  }

  y = blocoPagamento(doc, y, dadosCliente);
  y = blocoObservacoes(doc, y, dados.observacoes);

  let finalY = blocoTotais(doc, y, totais);

  if (finalY > PAGE_H - PAGE_BOTTOM) {
    const y2 = novaPagina(doc);
    finalY = blocoTotais(doc, y2, totais);
  }

  rodape(doc, dados.numero || 'ORÇAMENTO', dados.dataValidade || '');
  doc.save(`orcamento-${dados.numero || Date.now()}.pdf`);
}