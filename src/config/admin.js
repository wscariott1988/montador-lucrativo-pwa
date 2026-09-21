// Configuracao do Painel Admin — vem de VITE_ADMIN_EMAIL e VITE_ADMIN_WHATSAPP.
// Precisa bater com firestore.rules (funcao isAdmin).
export const ADMIN_EMAIL = String(import.meta.env.VITE_ADMIN_EMAIL ?? '')
  .trim()
  .toLowerCase();

// WhatsApp do admin no formato correto pra wa.me: somente numeros, com DDI+DDD.
export const ADMIN_WHATSAPP = String(import.meta.env.VITE_ADMIN_WHATSAPP ?? '')
  .replace(/\D+/g, '');

export function isAdminEmail(email) {
  return Boolean(email) && String(email).trim().toLowerCase() === ADMIN_EMAIL && ADMIN_EMAIL !== '';
}