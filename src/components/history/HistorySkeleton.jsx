import { Loader2, RefreshCw, Route, FileText, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

function block() {
  return <div className="h-4 animate-pulse rounded-md bg-surface-container-highest" />;
}

export default function HistorySkeleton({ count = 6 }) {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Carregando histórico">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-xl border border-zinc-border bg-surface-container p-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-surface-container-highest" />
            <div className="flex-1 space-y-2">
              {block()}
              {block()}
            </div>
            <div className="h-7 w-20 shrink-0 animate-pulse rounded-full bg-surface-container-highest" />
          </div>
          <div className="h-8 w-36 animate-pulse rounded-md bg-surface-container-highest" />
          <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-high px-4 py-3">
            <Loader2 size={20} className="animate-spin text-primary-container" />
            <div className="h-6 flex-1 max-w-40 animate-pulse rounded-md bg-surface-container-highest" />
            <RefreshCw size={20} className="text-on-surface-variant" />
            <Route size={20} className="text-on-surface-variant" />
            <FileText size={20} className="text-on-surface-variant" />
            <Trash2 size={20} className="text-on-surface-variant" />
          </div>
        </div>
      ))}
    </div>
  );
}