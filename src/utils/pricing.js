// Calculos de precificacao e custos do montador

export function computeDepreciacaoMensal(valorCompra, vidaUtilMeses) {
  const valor = Number(valorCompra) || 0;
  const meses = Number(vidaUtilMeses) || 0;
  if (meses <= 0) return 0;
  return Math.round((valor / meses) * 100) / 100;
}

export function computeCustoMensalFerramentas(tools) {
  if (!Array.isArray(tools)) return 0;
  return tools.reduce(
    (acc, tool) => acc + computeDepreciacaoMensal(tool.valorCompra, tool.vidaUtilMeses),
    0
  );
}

// Valor hora calculado: custo mensal (pro-labore + fixos + DAS/depreciacao)
// dividido pelas horas disponiveis no mes e acrescido de margem/imposto.
// Usado como SNAPSHOT no momento da criacao do orcamento.
export function computeValorHora(profile, tools = []) {
  const proLabore = Number(profile?.proLabore) || 0;
  const custosFixos = Number(profile?.custosFixos) || 0;
  const valorDas = Number(profile?.valorDas) || 0;
  const impostoPercentual = Number(profile?.impostoPercentual) || 0;
  const margem = Number(profile?.metaLucro) || 0;
  const horasDia = Number(profile?.horasTrabalhadasDia) || 0;
  const diasMes = Number(profile?.diasTrabalhadosMes) || 0;

  const horasMes = horasDia * diasMes;
  const custoBase =
    proLabore + custosFixos + computeCustoMensalFerramentas(tools) + valorDas;

  if (custoBase <= 0 || horasMes <= 0) return 0;

  const custoHora = custoBase / horasMes;
  const faixaReserva =
    margem / 100 + (profile?.regime === 'simples' ? impostoPercentual / 100 : 0);
  const divisor = Math.max(0.2, 1 - faixaReserva);

  return Math.round((custoHora / divisor) * 100) / 100;
}