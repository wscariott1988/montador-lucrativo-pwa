import { useEffect, useRef, useState } from 'react';
import { Hammer } from 'lucide-react';

export default function AppHeader({ title, subtitle }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  // Auto-hide: esconde o header ao rolar para baixo e reaparece ao subir.
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY ?? 0;
      const delta = y - lastY.current;
      if (y > 88 && delta > 4) {
        setHidden(true);
      } else if (delta < -4 || y <= 88) {
        setHidden(false);
      }
      lastY.current = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-surface/90 pt-safe backdrop-blur-xl transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-primary-container text-on-primary-container">
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
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary text-on-primary"
        >
          <Hammer size={18} />
        </button>
      </div>
    </header>
  );
}