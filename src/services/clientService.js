import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { normalizePhoneBR } from '../utils/formatters';

const clientsRef = (uid) => collection(db, 'users', uid, 'clientes');

export async function addClient(uid, data) {
  await addDoc(clientsRef(uid), {
    nome: String(data.nome ?? '').trim(),
    telefone: String(data.telefone ?? '').trim(),
    telefoneNormalizado: normalizePhoneBR(data.telefone),
    endereco: String(data.endereco ?? '').trim(),
    cpf: String(data.cpf ?? '').trim(),
    dataNascimento: data.dataNascimento ?? '',
    createdAt: serverTimestamp(),
  });
}

export async function updateClient(uid, clientId, data) {
  await updateDoc(doc(db, 'users', uid, 'clientes', clientId), {
    nome: String(data.nome ?? '').trim(),
    telefone: String(data.telefone ?? '').trim(),
    telefoneNormalizado: normalizePhoneBR(data.telefone),
    endereco: String(data.endereco ?? '').trim(),
    cpf: String(data.cpf ?? '').trim(),
    dataNascimento: data.dataNascimento ?? '',
    updatedAt: serverTimestamp(),
  });
}

export function deleteClient(uid, clientId) {
  return deleteDoc(doc(db, 'users', uid, 'clientes', clientId));
}