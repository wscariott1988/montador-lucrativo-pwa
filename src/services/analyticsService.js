import { doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// ---------------------------------------------------------------------------
// METRICAS E ENGAGAMENTO — grava no documento /users/{uid} de cada montador.
// Regras atuais do Firestore ja permitem o proprio usuario atualizar o proprio
// documento (isOwner) e o admin ler tudo (isAdmin). Funcoes sao fire-and-forget:
// nunca devem travar o fluxo da UI se a rede falhar.
// ---------------------------------------------------------------------------

// Acesso / sessao: incrementa acessosCount e atualiza ultimoAcessoAt.
// Chamado sempre que a sessao inicia ou o app e recarregado.
export async function registrarAcesso(uid) {
  if (!uid) return;
  try {
    await updateDoc(doc(db, 'users', uid), {
      acessosCount: increment(1),
      ultimoAcessoAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (error?.code !== 'not-found') {
      console.warn('[Analytics] acesso:', error.code || error.message);
    }
  }
}

// Acumula tempo de uso (minutos) no documento do usuario.
export async function somarTempoUso(uid, minutos) {
  if (!uid || !(minutos > 0)) return;
  try {
    await updateDoc(doc(db, 'users', uid), {
      tempoUsoMinutos: increment(Math.round(minutos)),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (error?.code !== 'not-found') {
      console.warn('[Analytics] tempo de uso:', error.code || error.message);
    }
  }
}

// Incrementa o total de orcamentos criados pelo montador.
export async function incrementarOrcamentos(uid) {
  if (!uid) return;
  try {
    await updateDoc(doc(db, 'users', uid), {
      orcamentosCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (error?.code !== 'not-found') {
      console.warn('[Analytics] orcamentos:', error.code || error.message);
    }
  }
}