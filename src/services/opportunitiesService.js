import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const oportunidadesCol = () => collection(db, 'oportunidades');

// ---------------------------------------------------------------------------
// RADAR (montador): stream ao vivo de vagas DISPONIVEIS, mais recentes primeiro.
// Erro de indice composto (status + createdAt) é capturado ativamente e o link
// de criacao do indice extraido no handler onError da view.
// ---------------------------------------------------------------------------
export function streamOportunidadesDisponiveis(onNext, onError) {
  const q = query(
    oportunidadesCol(),
    where('status', '==', 'disponivel'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const itens = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      onNext(itens);
    },
    (error) => onError(error)
  );
}

// Extrai a URL de criacao de indice composto que o Firestore devolve no erro.
export function extractMissingIndexUrl(error) {
  const raw =
    error?.customData?.originalError?.message || error?.message || '';
  const match = String(raw).match(/https:\/\/[^\s'">]+/i);
  return match ? match[0] : '';
}

// ---------------------------------------------------------------------------
// PAINEL ADMIN
// ---------------------------------------------------------------------------

// CRM: primeiros 50 usuarios (FREE SHIELD - performance), mais novos primeiro.
export async function fetchUsersAdmin(pageSize = 50) {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(pageSize));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

// Publica uma oportunidade (status 'disponivel').
export async function postOportunidadeAdmin({
  titulo,
  descricao,
  cidadeUf,
  valorEstimado,
}) {
  await addDoc(oportunidadesCol(), {
    titulo: String(titulo ?? '').trim(),
    descricao: String(descricao ?? '').trim(),
    cidadeUf: String(cidadeUf ?? '').trim(),
    valorEstimado: Number(valorEstimado) || 0,
    status: 'disponivel',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Gestao de vagas (todas as status), mais recentes primeiro.
export async function fetchOportunidadesAdmin() {
  const q = query(oportunidadesCol(), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

// Altera o status (atribuido / cancelado / disponivel).
export async function setOportunidadeStatusAdmin(oportunidadeId, status) {
  await updateDoc(doc(db, 'oportunidades', oportunidadeId), {
    status,
    updatedAt: serverTimestamp(),
  });
}