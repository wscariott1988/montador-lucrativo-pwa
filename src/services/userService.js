import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { normalizePhoneBR, formatPhoneDisplayBR } from '../utils/formatters';

export const TRIAL_DAYS = 30;

// Antifraude: consulta a colecao /users buscando o telefone normalizado.
// Se existir vinculo com OUTRO uid, o cadastro deve ser bloqueado (1 telefone = 1 conta).
export async function findUserByPhone(phoneValue) {
  const digits = normalizePhoneBR(phoneValue);
  if (!digits || digits.length < 11) return null;

  const q = query(
    collection(db, 'users'),
    where('telefoneNormalizado', '==', digits),
    limit(1)
  );
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : snapshot.docs[0].data();
}

export async function fetchUserProfile(uid) {
  if (!uid) return null;
  try {
    const ref = doc(db, 'users', uid);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? { uid, ...snapshot.data() } : null;
  } catch (error) {
    console.warn('[userService] Falha ao buscar perfil:', error.code || error.message);
    return null;
  }
}

export function trialEndDate(from = new Date()) {
  const end = new Date(from.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  end.setHours(23, 59, 59, 999);
  return end;
}

export async function createTrialProfile({ uid, email, telefone }) {
  const digits = normalizePhoneBR(telefone);

  // REGRA ANTIFRAUDE OBRIGATORIA: verificar telefone unico ANTES de gravar.
  // Sem conexao a checagem falha e o cadastro e bloqueado (nao se pode
  // garantir unicidade off-line).
  const existing = await findUserByPhone(telefone);
  if (existing && existing.uid !== uid) {
    const error = new Error('Este número de WhatsApp já está vinculado a outra conta.');
    error.code = 'phone-already-in-use';
    throw error;
  }

  const profile = {
    uid,
    email: email ?? null,
    telefone: formatPhoneDisplayBR(telefone),
    telefoneNormalizado: digits,
    plano: 'trial',
    trialDataInicio: serverTimestamp(),
    trialDataFim: Timestamp.fromDate(trialEndDate()),
    dataVencimento: Timestamp.fromDate(trialEndDate()),
    statusAssinatura: 'trial',
    privacidadeValores: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', uid), profile);
  return { uid, ...profile };
}

// ---------------------------------------------------------------------------
// ADMIN — controle de assinatura (R$ 19,90/mes).
// Recebe uma Date (apenas dia) e define dataVencimento + statusAssinatura.
// Permitido apenas pelo Firestore (isAdmin()) ou pelo proprio dono.
// ---------------------------------------------------------------------------
export async function atualizarAssinaturaAdmin({ uid, dataVencimento }) {
  const due =
    dataVencimento instanceof Date && !Number.isNaN(dataVencimento.getTime())
      ? dataVencimento
      : trialEndDate();
  due.setHours(23, 59, 59, 999);

  const hoje = new Date();
  const vencida = new Date(due.getFullYear(), due.getMonth(), due.getDate()) <
    new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  await setDoc(
    doc(db, 'users', uid),
    {
      dataVencimento: Timestamp.fromDate(due),
      statusAssinatura: vencida ? 'expirada' : 'ativa',
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}