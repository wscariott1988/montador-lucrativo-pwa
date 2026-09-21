export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-border bg-surface-container/40 px-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
        <Icon size={28} strokeWidth={2} />
      </div>
      <div>
        <p className="text-base font-bold tracking-wide text-on-surface">{title}</p>
        {description ? (
          <p className="mt-1 text-[15px] font-normal text-on-surface-variant">{description}</p>
        ) : null}
      </div>
    </div>
  );
}