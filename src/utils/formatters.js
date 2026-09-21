export function digitsOnly(value) {
  return String(value ?? '').replace(/\D+/g, '');
}

export function isBRPhone(value) {
  const d = digitsOnly(value);
  return d.length === 10 || d.length === 11;
}

export function normalizePhoneBR(value) {
  return '55' + digitsOnly(value);
}

export function maskPhoneBR(value) {
  const d = digitsOnly(value).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function formatPhoneDisplayBR(value) {
  return maskPhoneBR(value);
}

export function formatBRL(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 'R$ 0,00';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function parseBRLtoNumber(value) {
  const cleaned = String(value ?? '')
    .replace(/R\$/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const n = Number.parseFloat(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

export function toISODate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function maskCpf(value) {
  const d = digitsOnly(value).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function waMeUrl(telefone) {
  const d = digitsOnly(telefone);
  const withCc = d.startsWith('55') && (d.length === 12 || d.length === 13) ? d : `55${d}`;
  return `https://wa.me/${withCc}`;
}

export function formatMonthLabel(ano, mes) {
  const date = new Date(ano, mes - 1, 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export function formatDateBR(iso) {
  if (!iso) return '';
  const [y, m, d] = String(iso).split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

export function addDaysISO(days, from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  d.setDate(d.getDate() + Number(days) || 0);
  return toISODate(d);
}

// AAA/AAAA HH:mm — aceita Timestamp do Firestore, {seconds}, ISO e Date.
export function formatDateTimeBR(value) {
  if (!value) return '';
  let d = value;
  if (typeof d === 'object' && !(d instanceof Date)) {
    if (typeof d.toDate === 'function') d = d.toDate();
    else if (typeof d.seconds === 'number') d = new Date(d.seconds * 1000);
  }
  if (typeof d === 'string' || typeof d === 'number') d = new Date(d);
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Tempo relativo em portugues: "agora", "há 2 horas", "há 3 dias".
export function formatRelativeTime(value) {
  if (!value) return '';
  let d = value;
  if (typeof d === 'object' && !(d instanceof Date)) {
    if (typeof d.toDate === 'function') d = d.toDate();
    else if (typeof d.seconds === 'number') d = new Date(d.seconds * 1000);
  }
  if (typeof d === 'string' || typeof d === 'number') d = new Date(d);
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return '';

  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const abs = Math.abs(seconds);
  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

  const ranges = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];
  for (const range of ranges) {
    if (abs >= range.seconds) {
      return rtf.format(-Math.round(seconds / range.seconds), range.unit);
    }
  }
  return 'agora';
}