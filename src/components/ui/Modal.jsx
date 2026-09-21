import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-md rounded-t-2xl border border-b-0 border-zinc-border bg-surface-container p-5 pb-10 shadow-dewalt-bevel">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-on-surface">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}