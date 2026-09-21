import { AlertTriangle, MessageCircle } from 'lucide-react';
import {
  diasRestantesAssinatura,
  whatsappRenovacaoUrl,
} from '../../utils/subscription';
import { formatDateBR } from '../../utils/formatters';

function falarDias(dias) {
  if (dias === 0) return 'hoje';
  if (dias === 1) return '1 dia';
  return `${dias} dias`;
}

export default function SubscriptionBanner({ dataVencimento }) {
  const dias = diasRestantesAssinatura(dataVencimento);
  if (dias === null) return null;
  const url = whatsappRenovacaoUrl(
    `minha assinatura vence ${dias === 0 ? 'hoje' : `em ${falarDias(dias)}`}`
  );

  return (
    <div className="fixed inset-x-0 top-16 z-40 border-b border-error/30 bg-error-container/95 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-start gap-2.5">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-error" />
        <p className="min-w-0 flex-1 text-[15px] leading-snug text-on-surface">
          Sua assinatura vence {falarDias(dias)}
          {dias > 0 ? ' para renovar' : ''}. Renove para não perder o acesso ao app.
        </p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 flex h-12 items-center justify-center gap-2 rounded-lg bg-primary-container text-[15px] font-bold text-black transition-all hover:bg-primary-fixed active:translate-y-0.5"
      >
        <MessageCircle size={18} />
        Renovar por R$ 19,90 via WhatsApp
      </a>
    </div>
  );
}