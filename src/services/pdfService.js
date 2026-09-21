import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatBRL, formatDateBR } from '../utils/formatters';

const AMARELO = [255, 194, 0];
const TEXTO = [28, 28, 32];
const MUTED = [105, 105, 112];

const TABLE_STYLES = {
  font: 'helvetica',
  fontSize: 12,
  cellPadding: 2,
  valign: 'middle',
  overflow: 'linebreak',
  lineColor: [46, 48, 56],
  lineWidth: 0.2,
  textColor: TEXTO,
};

export function generateBudgetPdf(dados) {
  // Formato continuo vertical (108 x 192 mm) tipo recibo de campo.
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [108, 192],
  });

  const MARGIN = 8;
  const pageWidth = doc.internal.pageSize.getWidth() - MARGIN * 2;
  let y = 16;

  // Cabecalho
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(AMARELO[0], AMARELO[1], AMARELO[2]);
  doc.text('ORÇAMENTO DE MONTAGEM', MARGIN, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(TEXTO[0], TEXTO[1], TEXTO[2]);
  doc.text(`Ref: #${dados.numero}`, MARGIN, y);
  y += 6;

  const writeHeader = (label, value) => {
    if (!value) return;
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}: `, MARGIN, y);
    const lw = doc.getTextWidth(`${label}: `);
    doc.setFont('helvetica', 'normal');
    doc.text(value, MARGIN + lw, y);
    y += 6;
  };

  writeHeader('Cliente', dados.clienteNome || '-');
  writeHeader('Cidade', dados.cidade);
  writeHeader('Data da montagem', formatDateBR(dados.dataServico));
  writeHeader('Valor hora aplicado', dados.valorHoraAplicado ? formatBRL(dados.valorHoraAplicado) : 'Não configurado');

  if (dados.itensServicos.length) {
    autoTable(doc, {
      startY: y + 2,
      margin: { left: MARGIN, right: MARGIN, top: 6, bottom: 8 },
      pageBreak: 'auto',
      head: [['Serviço', 'Qtd', 'R$']],
      body: dados.itensServicos.map((item) => [
        item.nome,
        String(item.quantidade),
        formatBRL(item.subtotal),
      ]),
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 12, halign: 'center' },
        2: { cellWidth: 24, halign: 'right' },
      },
      styles: TABLE_STYLES,
      headStyles: {
        fillColor: AMARELO,
        textColor: TEXTO,
        fontStyle: 'bold',
        fontSize: 12,
      },
      alternateRowStyles: { fillColor: [242, 242, 242] },
    });
    y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : y + 6;
  } else {
    y += 2;
  }

  if (dados.itensPecas.length) {
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN, top: 6, bottom: 8 },
      pageBreak: 'auto',
      head: [['Peça', 'Qtd', 'R$']],
      body: dados.itensPecas.map((item) => [
        item.nome,
        String(item.quantidade),
        formatBRL(item.subtotal),
      ]),
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 12, halign: 'center' },
        2: { cellWidth: 24, halign: 'right' },
      },
      styles: TABLE_STYLES,
      headStyles: {
        fillColor: AMARELO,
        textColor: TEXTO,
        fontStyle: 'bold',
        fontSize: 12,
      },
      alternateRowStyles: { fillColor: [242, 242, 242] },
    });
    y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : y + 6;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(TEXTO[0], TEXTO[1], TEXTO[2]);
  doc.text(`Serviços: ${formatBRL(dados.totalServicos)}   Peças: ${formatBRL(dados.totalPecas)}`, MARGIN, y);
  y += 6;
  if (dados.taxaDeslocamento > 0) {
    doc.text(`Deslocamento: ${formatBRL(dados.taxaDeslocamento)}`, MARGIN, y);
    y += 6;
  }
  if (dados.descontoAplicado > 0) {
    doc.text(
      `Desconto (${dados.descontoTipo === 'percentual' ? '%' : 'R$'}): -${formatBRL(dados.descontoAplicado)}`,
      MARGIN,
      y
    );
    y += 6;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(AMARELO[0], AMARELO[1], AMARELO[2]);
  doc.text(`TOTAL: ${formatBRL(dados.totalGeral)}`, MARGIN, y + 2);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(TEXTO[0], TEXTO[1], TEXTO[2]);
  doc.text(`Válido até: ${formatDateBR(dados.dataValidade)}`, MARGIN, y);
  y += 6;
  if (dados.formaPagamento) {
    doc.text(`Pagamento: ${dados.formaPagamento}`, MARGIN, y);
    y += 6;
  }

  if (dados.observacoes) {
    const obs = doc.splitTextToSize(
      `Obs.: ${dados.observacoes}`,
      pageWidth
    );
    if (y + obs.length * 5 > 190) {
      doc.addPage();
      y = 14;
    }
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(obs, MARGIN, y);
  }

  doc.save(`orcamento-${dados.numero}.pdf`);
}