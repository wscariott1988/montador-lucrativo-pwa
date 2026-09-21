import { NavLink } from 'react-router-dom';
import { SlidersHorizontal, Users, Plus, History, Wallet, Radar } from 'lucide-react';

const TABS = [
  { to: '/app/ajustes', label: 'Ajustes', icon: SlidersHorizontal },
  { to: '/app/clientes', label: 'Clientes', icon: Users },
  { to: '/app/novo', label: 'Novo', icon: Plus, fab: true },
  { to: '/app/historico', label: 'Histórico', icon: History },
  { to: '/app/financas', label: 'Finanças', icon: Wallet },
  { to: '/app/radar', label: 'Radar', icon: Radar },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 bg-surface-container/95 pb-safe shadow-[0_1px_8px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div className="relative flex h-20 items-center justify-around px-2">
        {TABS.map((tab) =>
          tab.fab ? (
            <NavLink
              key={tab.label}
              to={tab.to}
              className="relative flex -top-5 flex-col items-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-container text-on-primary-container shadow-yellow-bevel transition-all active:translate-y-0.5 active:shadow-none">
                <Plus size={32} strokeWidth={2.5} />
              </span>
              <span className="mt-1 text-[15px] font-bold tracking-wide text-primary-container">
                {tab.label}
              </span>
            </NavLink>
          ) : (
            <NavLink
              key={tab.label}
              to={tab.to}
              className={({ isActive }) =>
                `flex min-h-[56px] min-w-[56px] flex-col items-center justify-center px-2 transition-colors ${
                  isActive ? 'text-primary-container' : 'text-on-surface-variant'
                }`
              }
            >
              <tab.icon size={22} strokeWidth={2} />
              <span
                className={`mt-1 text-[15px] ${isActive ? 'font-bold' : 'font-medium'}`}
              >
                {tab.label}
              </span>
            </NavLink>
          )
        )}
      </div>
    </nav>
  );
}