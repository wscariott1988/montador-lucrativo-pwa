const AUTH_ERROR_MESSAGES = {
  'auth/invalid-email': 'E-mail inválido. Verifique o endereço digitado.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'Nenhuma conta encontrada com esse e-mail.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado. Tente fazer login.',
  'auth/weak-password': 'Senha muito fraca (mínimo de 6 caracteres).',
  'auth/missing-password': 'Informe sua senha.',
  'auth/network-request-failed': 'Sem conexão com a internet. Verifique o 4G/Wi-Fi.',
  'auth/too-many-requests': 'Muitas tentativas em sequência. Aguarde alguns minutos.',
  'auth/invalid-api-key': 'Firebase ainda não configurado. Adicione as credenciais em .env.local.',
  'auth/operation-not-allowed': 'Criação de conta desativada. Contate o suporte.',
  'auth/user-disabled': 'Esta conta foi desativada.',
};

const FIRESTORE_ERROR_MESSAGES = {
  'permission-denied': 'Sem permissão para acessar esses dados.',
  'not-found': 'Registro não encontrado.',
  'unavailable': 'Serviço indisponível. Tente novamente.',
  'network-request-failed': 'Sem conexão com a internet. Verifique o 4G/Wi-Fi.',
  'deadline-exceeded': 'Tempo de resposta excedido. Tente novamente.',
};

export function getAuthErrorMessage(code) {
  return AUTH_ERROR_MESSAGES[code] || 'Falha na autenticação. Tente novamente.';
}

export function getFirestoreErrorMessage(code) {
  return FIRESTORE_ERROR_MESSAGES[code] || 'Falha ao acessar os dados. Tente novamente.';
}