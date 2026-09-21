import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-primary-container text-on-primary-container font-bold shadow-yellow-bevel hover:bg-primary-fixed active:translate-y-0.5 active:shadow-none',
  secondary:
    'bg-surface-container text-on-surface font-semibold border border-zinc-border hover:bg-surface-container-high',
  outline:
    'border border-primary-container/70 text-primary-container font-bold hover:bg-primary-container/10',
  danger:
    'bg-error text-on-error font-bold shadow-red-bevel hover:bg-[#DC2626] active:translate-y-0.5 active:shadow-none',
};

const SIZES = {
  sm: 'h-10 px-3 text-[15px]',
  md: 'h-12 px-4 text-[15px]',
  lg: 'h-14 px-6 text-[16px]',
};

export default function Button({
  variant = 'primary',
  size = 'lg',
  loading = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg tracking-wide transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : null}
      {children}
    </button>
  );
}