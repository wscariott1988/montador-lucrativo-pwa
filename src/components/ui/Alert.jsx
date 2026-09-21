import { TriangleAlert } from 'lucide-react';

const TONES = {
  error: 'border-error/50 bg-error-container/50 text-on-surface',
  success: 'border-tertiary/50 bg-tertiary/10 text-tertiary',
  warning: 'border-primary-container/50 bg-primary-container/10 text-primary-container',
};

export default function Alert({ tone = 'error', children }) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-[15px] leading-snug ${TONES[tone]}`}
    >
      <TriangleAlert size={20} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}