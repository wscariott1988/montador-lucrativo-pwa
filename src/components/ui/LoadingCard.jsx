import { Loader2 } from 'lucide-react';

export default function LoadingCard({ label = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-border bg-surface-container px-6 py-12 text-center">
      <Loader2 size={28} className="animate-spin text-primary-container" />
      <p className="text-[15px] font-semibold uppercase tracking-wide text-on-surface-variant">
        {label}
      </p>
    </div>
  );
}