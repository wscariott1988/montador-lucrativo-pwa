import { Target } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { computeCustoMensalFerramentas } from '../../utils/pricing';
import { formatBRL } from '../../utils/formatters';

export default function MetaPanel({ faturado }) {
  const { profile, tools } = useAppData();

  const proLabore = profile?.proLabore || 0;
  const custosFixos = profile?.custosFixos || 0;
  const imposto =
    profile?.regime === 'simples'
      ? (faturado * (profile?.impostoPercentual || 0)) / 100
      : profile?.valorDas || 0;
  const depreciacao = computeCustoMensalFerramentas(tools);
  const custoTotal = proLabore + custosFixos + imposto + depreciacao;

  const margem = (profile?.metaLucro || 0) / 100;
  const meta = custoTotal > 0 ? custoTotal / Math.max(0.0001, 1 - margem) : 0;
  const diasTrabalhados = profile?.diasTrabalhadosMes || 22;

  const percent = meta > 0 ? Math.min(100, (faturado / meta) * 100) : 0;
  let diasFaltantes = 0;
  if (meta > 0 && faturado < meta && diasTrabalhados > 0) {
    const metaDiaria = meta / diasTrabalhados;
    diasFaltantes = Math.max(1, Math.ceil((meta - faturado) / metaDiaria));
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-zinc-border bg-surface-container p-4">
      <div className="flex items-center gap-2">
        <Target size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold text-on-surface">Meta do mês</h3>
      </div>

      {meta > 0 ? (
        <>
          <p className="text-[15px] font-normal leading-snug text-on-surface-variant">
            Custo do mês (pró-labore, custos, imposto, ferramentas):{' '}
            <span className="font-mono font-bold text-on-surface">{formatBRL(custoTotal)}</span>
            <span className="mx-1">•</span>Alvo:{' '}
            <span className="font-mono font-bold text-primary-container">{formatBRL(meta)}</span>
          </p>

          <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="h-full rounded-full bg-primary-container transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          {faturado >= meta ? (
            <p className="text-[15px] font-bold text-tertiary">Meta do mês batida!</p>
          ) : (
            <p className="text-[15px] font-normal text-on-surface-variant">
              Faltam aprox.{' '}
              <span className="font-bold text-primary-container">
                {diasFaltantes} {diasFaltantes === 1 ? 'dia' : 'dias'}
              </span>{' '}
              de trabalho para bater a meta
            </p>
          )}
        </>
      ) : (
        <p className="text-[15px] font-normal text-on-surface-variant">
          Preencha pró-labore, custos fixos, imposto e ferramentas em Ajustes para calcular a meta
          do mês.
        </p>
      )}
    </section>
  );
}