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

// Horas trabalhaveis padrao quando o usuario nao preenche jornada:
// padrao CLT/assalariado = 8h/dia x 22 dias uteis = 176h/mes.
export function computeHorasTrabalhadasMes(profile) {
  const horasDia = Number(profile?.horasTrabalhadasDia) || 0;
  const diasMes = Number(profile?.diasTrabalhadosMes) || 0;
  if (horasDia > 0 && diasMes > 0) return horasDia * diasMes;
  if (horasDia > 0) return horasDia * 22;
  if (diasMes > 0) return 8 * diasMes;
  return 176;
}

// Valor hora calculado (diretriz 2026):
// (Pro-labore + Despesas Fixas + Depreciacao Total de Ferramentas) / Horas do mes.
// Usado como SNAPSHOT no momento da criacao do orcamento e no badge fixo.
export function computeValorHora(profile, tools = []) {
  const proLabore = Number(profile?.proLabore) || 0;
  const custosFixos = Number(profile?.custosFixos) || 0;
  const horasMes = computeHorasTrabalhadasMes(profile);

  const custoBase =
    proLabore + custosFixos + computeCustoMensalFerramentas(tools);

  if (custoBase <= 0 || horasMes <= 0) return 0;

  return Math.round((custoBase / horasMes) * 100) / 100;
}

// Percentual de vida util ja consumida (%) com base na data de criacao da
// ferramenta vs. a vida util estimada em meses. >= 100 => depreciavel/esgotada.
export function computePercentualVidaUtil(tool) {
  if (!tool) return 0;
  const meses = Number(tool?.vidaUtilMeses) || 0;
  if (meses <= 0) return 0;

  let criacao = null;
  const raw = tool?.createdAt;
  if (raw instanceof Date) criacao = raw;
  else if (raw?.toDate) criacao = raw.toDate();
  else if (typeof raw?.seconds === 'number') criacao = new Date(raw.seconds * 1000);
  else if (typeof raw === 'string' || typeof raw === 'number') criacao = new Date(raw);

  if (!criacao || Number.isNaN(criacao.getTime())) return 0;

  const elapsadoMs = Date.now() - criacao.getTime();
  const mesesDecorridos = elapsadoMs / (30.4375 * 24 * 60 * 60 * 1000);
  const percent = (mesesDecorridos / meses) * 100;
  if (percent <= 0) return 0;
  return Math.min(999, Math.round(percent));
}