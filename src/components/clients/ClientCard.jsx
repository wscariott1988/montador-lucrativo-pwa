import { MessageCircle, MapPin, Pencil, Trash2, FileText } from 'lucide-react';
import { waMeUrl, formatPhoneDisplayBR } from '../../utils/formatters';

export default function ClientCard({ client, onEdit, onDelete }) {
  const hasDetails = client.endereco || client.cpf;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-border bg-surface-container p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
          <span className="text-[15px] font-extrabold uppercase">
            {String(client.nome ?? '?').slice(0, 1)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-on-surface">{client.nome}</p>
          <p className="mt-0.5 font-mono text-[15px] font-bold text-primary-container">
            {formatPhoneDisplayBR(client.telefone)}
          </p>
        </div>
        <a
          href={waMeUrl(client.telefone)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Chamar ${client.nome} no WhatsApp`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-tertiary text-on-tertiary transition-all active:translate-y-0.5"
        >
          <MessageCircle size={24} />
        </a>
      </div>

      {hasDetails ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {client.endereco ? (
            <span className="flex min-h-[24px] items-center gap-1.5 text-[15px] text-on-surface-variant">
              <MapPin size={16} className="shrink-0" />
              <span className="truncate">{client.endereco}</span>
            </span>
          ) : null}
          {client.cpf ? (
            <span className="flex min-h-[24px] items-center gap-1.5 text-[15px] text-on-surface-variant">
              <FileText size={16} className="shrink-0" />
              <span className="font-mono">{client.cpf}</span>
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center gap-2 border-t border-zinc-border pt-3">
        <button
          type="button"
          aria-label={`Editar ${client.nome}`}
          onClick={() => onEdit(client)}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-surface-container-high text-[15px] font-semibold text-on-surface transition-colors hover:bg-surface-container-highest"
        >
          <Pencil size={18} />
          Editar
        </button>
        <button
          type="button"
          aria-label={`Remover ${client.nome}`}
          onClick={() => onDelete(client)}
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-error-container/50 text-error transition-colors hover:bg-error/20"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}