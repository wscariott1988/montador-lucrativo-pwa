import { NavLink } from 'react-router-dom';
import { SlidersHorizontal, Users, Plus, History, Wallet } from 'lucide-react';

const TABS = [
  { to: '/app/ajustes', label: 'Ajustes', icon: SlidersHorizontal },
  { to: '/app/clientes', label: 'Clientes', icon: Users },
  { to: '/app/novo', label: 'Novo', icon: Plus, fab: true },
  { to: '/app/historico', label: 'Histórico', icon: History },
  { to: '/app/financas', label: 'Finanças', icon: Wallet },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 bg-surface-container/95 pb-safe shadow-[0_1px_8px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div className="grid h-20 grid-cols-5 items-end px-2">
        {TABS.map((tab) =>
          tab.fab ? (
            <NavLink
              key={tab.label}
              to={tab.to}
              className="relative flex flex-col items-center justify-center"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded border-2 border-[#FFC800] bg-primary-container text-on-primary-container shadow-yellow-bevel transition-all active:translate-y-0.5 active:shadow-none ${
                      isActive ? '-translate-y-0.5' : '-translate-y-2'
                    }`}
                  >
                    <Plus size={30} strokeWidth={3} />
                  </span>
                  <span className="mt-1 text-[15px] font-bold tracking-wide text-primary-container">
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          ) : (
            <NavLink
              key={tab.label}
              to={tab.to}
              className={({ isActive }) =>
                `flex min-h-[56px] flex-col items-center justify-center transition-colors ${
                  isActive ? 'text-primary-container' : 'text-on-surface-variant'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <tab.icon size={22} strokeWidth={2} />
                  <span
                    className={`mt-1 text-[15px] ${isActive ? 'font-bold' : 'font-medium'}`}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          )
        )}
      </div>
    </nav>
  );
}