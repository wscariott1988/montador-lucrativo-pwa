import { Outlet, useLocation } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useAppData } from '../../context/AppDataContext';
import useAnalytics from '../../hooks/useAnalytics';
import {
  assinaturaExpirada,
  assinaturaPertoVencer,
} from '../../utils/subscription';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';
import SubscriptionBanner from './SubscriptionBanner';
import SubscriptionLockScreen from './SubscriptionLockScreen';

const TAB_META = {
  ajustes: 'Ajustes do montador',
  clientes: 'Base de contatos',
  novo: 'Criar orçamento',
  historico: 'Orçamentos salvos',
  financas: 'Painel financeiro',
  radar: 'Radar de oportunidades',
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const online = useOnlineStatus();
  const { profile } = useAppData();
  const segment = pathname.split('/')[2] ?? 'novo';
  const subtitle = TAB_META[segment] || 'Montador Lucrativo';

  const dataVencimento = profile?.dataVencimento;
  const expirada = assinaturaExpirada(dataVencimento);
  const pertoVencer = !expirada && assinaturaPertoVencer(dataVencimento);

  // Acessos/sessao + tempo de uso em segundo plano (metricas de engajamento).
  useAnalytics();

  // Assinatura vencida: bloqueia TODO o acesso ao app ate acertar a mensalidade.
  if (expirada) {
    return <SubscriptionLockScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-dark">
      <AppHeader subtitle={subtitle} />
      <main className={`w-full flex-1 px-4 pb-32 ${pertoVencer ? 'pt-[10.5rem]' : 'pt-16'}`}>
        {pertoVencer ? <SubscriptionBanner dataVencimento={dataVencimento} /> : null}
        {!online ? (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-error/40 bg-error-container/40 px-3 py-2 text-[15px] font-semibold text-on-surface">
            <WifiOff size={18} className="shrink-0 text-error" />
            Offline — alterações ficam salvas no aparelho e sincronizam ao reconectar
          </div>
        ) : null}
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}