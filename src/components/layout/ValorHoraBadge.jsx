import { useNavigate } from 'react-router-dom';
import { Clock3, Calculator, Eye, EyeOff } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { computeValorHora, computeHorasTrabalhadasMes } from '../../utils/pricing';

// Badge fixo "Valor da Hora" exibido no topo de todas as telas do usuario.
// Leva o usuario a Ajustes quando os custos ainda nao foram configurados.
export default function ValorHoraBadge() {
  const { profile, tools, formatCurrency, privacidade, togglePrivacidade } = useAppData();
  const navigate = useNavigate();

  const valorHora = computeValorHora(profile, tools);
  const horasMes = computeHorasTrabalhadasMes(profile);
  const horasPadrao = !(Number(profile?.horasTrabalhadasDia) > 0 && Number(profile?.diasTrabalhadosMes) > 0);

  return (
    <div className="fixed inset-x-0 top-16 z-40 border-b border-[#FFC800]/60 bg-[#181818]/95 backdrop-blur-xl">
      <div className="flex h-11 items-center gap-2 px-4">
        <Clock3 size={16} className="shrink-0 text-primary-container" />

        {valorHora > 0 ? (
          <>
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-on-surface-variant">
              Valor da Hora
              {horasPadrao ? (
                <span className="ml-1 font-normal text-on-surface-variant/60">
                  · {horasMes}h/mês padrão
                </span>
              ) : null}
            </span>
            <span className="shrink-0 font-mono text-[17px] font-extrabold tracking-tight text-primary-container">
              {formatCurrency(valorHora)}
              <span className="ml-0.5 text-[13px] font-bold text-on-surface-variant">/h</span>
            </span>
          </>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/app/ajustes')}
            className="flex h-8 min-w-0 flex-1 items-center justify-center gap-1.5 rounded border border-[#FFC800]/70 bg-primary-container/15 px-2 text-[13px] font-bold text-primary-container transition-colors hover:bg-primary-container/25"
          >
            <Calculator size={16} className="shrink-0" />
            <span className="truncate">Calcular Valor da Hora</span>
          </button>
        )}

        <button
          type="button"
          onClick={togglePrivacidade}
          aria-label={privacidade ? 'Desativar modo privacidade' : 'Ativar modo privacidade'}
          aria-pressed={privacidade}
          title={privacidade ? 'Modo privacidade ativo' : 'Modo privacidade'}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded border transition-colors ${
            privacidade
              ? 'border-[#FFC800]/80 bg-primary-container text-on-primary-container'
              : 'border-zinc-border bg-surface-container text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {privacidade ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}