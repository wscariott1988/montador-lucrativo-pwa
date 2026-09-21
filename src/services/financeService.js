import {
  collection,
  query,
  where,
  addDoc,
  deleteDoc,
  onSnapshot,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { toISODate } from '../utils/formatters';

// FREE SHIELD: TODAS as consultas financeiras são SEMPRE filtradas por faixa de
// data (inicio/fim). Nunca se faz download do histórico completo. Os filtros são
// aplicados no campo 'data' (string YYYY-MM-DD) e 'dataServico' (orçamentos),
// ambos com indice de campo unico — sem custo de indice composto.

export function periodISO(ano, mes) {
  const mm = String(mes).padStart(2, '0');
  const lastDay = String(new Date(ano, mes, 0).getDate()).padStart(2, '0');
  return { inicio: `${ano}-${mm}-01`, fim: `${ano}-${mm}-${lastDay}` };
}

export function yearISO(ano) {
  return { inicio: `${ano}-01-01`, fim: `${ano}-12-31` };
}

function ref(uid, sub) {
  return collection(db, 'users', uid, sub);
}

function rangeQuery(uid, sub, { inicio, fim }) {
  return query(ref(uid, sub), where('data', '>=', inicio), where('data', '<=', fim));
}

export function streamDespesas(uid, range, onNext, onError) {
  return onSnapshot(
    rangeQuery(uid, 'despesas', range),
    (snapshot) => onNext(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError
  );
}

export function streamReceitas(uid, range, onNext, onError) {
  return onSnapshot(
    rangeQuery(uid, 'receitas_avulsas', range),
    (snapshot) => onNext(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError
  );
}

// Orcamentos pagos: consulta filtrada por dataServico dentro da faixa e
// status 'pago' checado no cliente (evita indice composto dataServico + status).
export function streamOrcamentosPagos(uid, { inicio, fim }, onNext, onError) {
  const q = query(
    ref(uid, 'orcamentos'),
    where('dataServico', '>=', inicio),
    where('dataServico', '<=', fim)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const pagos = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .filter((orcamento) => orcamento.status === 'pago' && orcamento.isDeleted !== true);
      onNext(pagos);
    },
    onError
  );
}

export async function addDespesa(uid, { descricao, valor, data }) {
  await addDoc(ref(uid, 'despesas'), {
    descricao: String(descricao ?? '').trim(),
    valor: Number(valor) || 0,
    data: data || toISODate(),
    criadoEm: serverTimestamp(),
  });
}

export async function addReceitaAvulsa(uid, { descricao, valor, data }) {
  await addDoc(ref(uid, 'receitas_avulsas'), {
    descricao: String(descricao ?? '').trim(),
    valor: Number(valor) || 0,
    data: data || toISODate(),
    criadoEm: serverTimestamp(),
  });
}

export function deleteDespesa(uid, id) {
  return deleteDoc(doc(db, 'users', uid, 'despesas', id));
}

export function deleteReceita(uid, id) {
  return deleteDoc(doc(db, 'users', uid, 'receitas_avulsas', id));
}