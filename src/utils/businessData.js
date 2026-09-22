// Dados minimos do negocio exigidos para exportacoes (PDF).
// O montador precisa de Nome profissional, CNPJ/CPF e Cidade para gerar a proposta.
export function dadosMinimosNegocioPendentes(profile) {
  const pendentes = [];
  if (!String(profile?.nomeProfissional ?? '').trim()) {
    pendentes.push('Nome profissional');
  }
  if (!String(profile?.cnpjCpf ?? '').trim()) {
    pendentes.push('CNPJ/CPF');
  }
  if (!String(profile?.cidade ?? '').trim()) {
    pendentes.push('Cidade');
  }
  return pendentes;
}

// Monta o objeto de identidade usado no cabecalho profissional do PDF.
export function montarDadosNegocio(profile) {
  return {
    nome: String(profile?.nomeProfissional ?? profile?.nomeEmpresa ?? '').trim(),
    documento: String(profile?.cnpjCpf ?? '').trim(),
    cidade: String(profile?.cidade ?? '').trim(),
    telefone: String(profile?.telefone ?? '').trim(),
    logoUrl: String(profile?.logoUrl ?? '').trim(),
  };
}