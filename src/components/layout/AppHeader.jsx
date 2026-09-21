import { Hammer } from 'lucide-react';

export default function AppHeader({ title, subtitle }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-surface/90 pt-safe backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
            <Hammer size={22} strokeWidth={2.5} />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[17px] font-bold leading-none text-primary-container">
              Montador Lucrativo
            </span>
            <span className="mt-0.5 truncate text-[13px] font-normal text-on-surface-variant">
              {subtitle}
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Perfil"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary"
        >
          <Hammer size={18} />
        </button>
      </div>
    </header>
  );
}