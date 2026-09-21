import { Outlet, useLocation } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';

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
  const segment = pathname.split('/')[2] ?? 'novo';
  const subtitle = TAB_META[segment] || 'Montador Lucrativo';

  return (
    <div className="flex min-h-screen flex-col bg-zinc-dark">
      <AppHeader subtitle={subtitle} />
      <main className="w-full flex-1 px-4 pt-16 pb-32">
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