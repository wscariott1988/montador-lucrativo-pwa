export default function Input({
  label,
  icon: Icon,
  prefix,
  className = '',
  rightSlot,
  ...props
}) {
  const hasLeftContent = Boolean(Icon || prefix);
  return (
    <label className="block w-full">
      {label ? (
        <span className="mb-1 block text-xs font-semibold tracking-wide text-on-surface-variant">
          {label}
        </span>
      ) : null}
      <div className="relative w-full">
        {Icon ? (
          <Icon
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
        ) : null}
        {prefix && !Icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[15px] font-bold text-on-surface-variant">
            {prefix}
          </span>
        ) : null}
        <input
          className={`h-14 w-full rounded-lg border border-zinc-border bg-surface-container px-4 text-[15px] font-normal text-on-surface placeholder:text-on-surface-variant/60 outline-none transition-colors focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 ${hasLeftContent ? 'pl-12' : ''} ${rightSlot ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {rightSlot ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightSlot}</div>
        ) : null}
      </div>
    </label>
  );
}