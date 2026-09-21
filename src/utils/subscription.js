import { ADMIN_WHATSAPP } from '../config/admin';

export const ASSINATURA_RENOVACAO_AVISO = 5;

// Converte Timestamp/Date/ISO para um Date limpo (apenas dia, sem hora).
function toDayStart(value, now = new Date()) {
  if (!value) return null;
  let d = value;
  if (typeof d === 'object' && !(d instanceof Date)) {
    if (typeof d.toDate === 'function') d = d.toDate();
    else if (typeof d.seconds === 'number') d = new Date(d.seconds * 1000);
  }
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Dias inteiros que faltam ate o vencimento. 0 = vence hoje, negativo = vencido.
export function diasRestantesAssinatura(dataVencimento, now = new Date()) {
  const due = toDayStart(dataVencimento);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!due) return null;
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

// Expirada: a data atual ja ultrapassou a dataDvencimento.
export function assinaturaExpirada(dataVencimento, now = new Date()) {
  const dias = diasRestantesAssinatura(dataVencimento, now);
  if (dias === null) return false;
  return dias < 0;
}

// A faltar 5 dias ou menos (nao expirada ainda).
export function assinaturaPertoVencer(dataVencimento, limite = ASSINATURA_RENOVACAO_AVISO, now = new Date()) {
  const dias = diasRestantesAssinatura(dataVencimento, now);
  if (dias === null) return false;
  return dias >= 0 && dias <= limite;
}

// Link do WhatsApp do admin com mensagem pre-preenchida sobre a renovacao.
export function whatsappRenovacaoUrl(extra = '') {
  const mensagem = `Olá! Quero renovar minha assinatura do Montador Lucrativo${extra ? ` — ${extra}` : ''}. Valor: R$ 19,90.`;
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}