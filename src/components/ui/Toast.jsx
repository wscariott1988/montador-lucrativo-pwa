import { useEffect } from 'react';
import { CheckCircle2, TriangleAlert } from 'lucide-react';

export default function Toast({ message, tone = 'success', onClose, duration = 2600 }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-6">
      <div
        role="status"
        className={`flex max-w-md items-center gap-2 rounded-xl border px-4 py-3 shadow-dewalt-bevel ${
          tone === 'success'
            ? 'border-tertiary/60 bg-surface-container-high text-tertiary'
            : 'border-error/60 bg-surface-container-high text-error'
        }`}
      >
        {tone === 'success' ? (
          <CheckCircle2 size={20} className="shrink-0" />
        ) : (
          <TriangleAlert size={20} className="shrink-0" />
        )}
        <span className="text-[15px] font-semibold">{message}</span>
      </div>
    </div>
  );
}