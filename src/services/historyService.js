import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const PAGE_SIZE = 20;

const orcsCol = (uid) => collection(db, 'users', uid, 'orcamentos');

// FREE SHIELD: leitura paginada — ordena por createdAt desc e nunca baixa a
// colecao inteira. Soft-deleted (isDeleted === true) sao filtrados no cliente.
export async function fetchOrcamentosPage(uid, { fromSnapshot = null } = {}, pageSize = PAGE_SIZE) {
  const q = fromSnapshot
    ? query(orcsCol(uid), orderBy('createdAt', 'desc'), startAfter(fromSnapshot), limit(pageSize))
    : query(orcsCol(uid), orderBy('createdAt', 'desc'), limit(pageSize));

  const snapshot = await getDocs(q);
  const items = snapshot.docs
    .filter((docItem) => docItem.data().isDeleted !== true)
    .map((docItem) => ({ id: docItem.id, ...docItem.data() }));

  return {
    items,
    lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
    hasMore: snapshot.size >= pageSize && snapshot.docs.some((docItem) => docItem.data().isDeleted !== true),
  };
}

export function setOrcamentoStatus(uid, orcamentoId, status) {
  return updateDoc(doc(db, 'users', uid, 'orcamentos', orcamentoId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export function softDeleteOrcamento(uid, orcamentoId) {
  return updateDoc(doc(db, 'users', uid, 'orcamentos', orcamentoId), {
    isDeleted: true,
    updatedAt: serverTimestamp(),
  });
}

// Reconstrói o snapshot congelado caso o documento antigo nao o tenha gravado
// (docs anteriores a Fase 6). Nao refaz consulta nem recalcula precos.
export function buildSnapshotFromDoc(orcamento) {
  const base = orcamento.snapshot && typeof orcamento.snapshot === 'object'
    ? orcamento.snapshot
    : {};

  return {
    numero: orcamento.numero ?? base.numero,
    clienteId: orcamento.clienteId ?? base.clienteId,
    clienteNome: orcamento.clienteNome ?? base.clienteNome,
    cliente: orcamento.cliente ?? base.cliente ?? { nome: orcamento.clienteNome },
    endereco: orcamento.endereco ?? base.endereco ?? '',
    cidade: orcamento.cidade ?? base.cidade ?? '',
    dataServico: orcamento.dataServico ?? base.dataServico,
    dataValidade: orcamento.dataValidade ?? base.dataValidade,
    valorHoraAplicado: orcamento.valorHoraAplicado ?? base.valorHoraAplicado,
    taxaDeslocamento: orcamento.taxaDeslocamento ?? base.taxaDeslocamento,
    totalServicos: orcamento.totalServicos ?? base.totalServicos ?? 0,
    totalPecas: orcamento.totalPecas ?? base.totalPecas ?? 0,
    totalGeral: orcamento.totalGeral ?? base.totalGeral ?? 0,
    descontoTipo: orcamento.descontoTipo ?? base.descontoTipo ?? 'valor',
    descontoAplicado: orcamento.descontoAplicado ?? base.descontoAplicado ?? 0,
    formaPagamento: orcamento.formaPagamento ?? base.formaPagamento ?? '',
    condicoesPagamento: orcamento.condicoesPagamento ?? base.condicoesPagamento ?? '',
    observacoes: orcamento.observacoes ?? base.observacoes ?? '',
    itensServicos: Array.isArray(orcamento.itensServicos)
      ? orcamento.itensServicos
      : Array.isArray(base.itensServicos)
        ? base.itensServicos
        : [],
    itensPecas: Array.isArray(orcamento.itensPecas)
      ? orcamento.itensPecas
      : Array.isArray(base.itensPecas)
        ? base.itensPecas
        : [],
  };
}

// Endereco completo para o GPS (Waze/Google Maps): endereco do orcamento
// (fallback: cliente cadastrado) + cidade.
export function buildEnderecoCompleto(orcamento, clientes) {
  const clienteMatch = clientes?.find((item) => item.id === orcamento.clienteId);
  const endereco =
    orcamento.endereco ??
    orcamento.snapshot?.endereco ??
    orcamento.cliente?.endereco ??
    clienteMatch?.endereco ??
    '';
  const cidade = orcamento.cidade ?? orcamento.snapshot?.cidade ?? '';
  return [String(endereco ?? '').trim(), String(cidade ?? '').trim()]
    .filter(Boolean)
    .join(', ');
}