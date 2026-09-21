import { LockKeyhole, MessageCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { whatsappRenovacaoUrl } from '../../utils/subscription';

export default function SubscriptionLockScreen() {
  const { signOut } = useAuth();
  const url = whatsappRenovacaoUrl('minha assinatura expirou');

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-zinc-dark px-6 pb-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error-container">
        <LockKeyhole size={30} className="text-error" strokeWidth={2.2} />
      </div>

      <h1 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-on-surface">
        Assinatura expirada
      </h1>
      <p className="mt-3 max-w-sm text-center text-[15px] leading-relaxed text-on-surface-variant">
        Sua assinatura do <span className="font-semibold text-on-surface">Montador Lucrativo</span>{' '}
        expirou. Para voltar a usar o app, acerte a mensalidade de{' '}
        <span className="font-bold text-primary-container">R$ 19,90</span> diretamente com o
        administrador pelo WhatsApp.
      </p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-primary-container text-[16px] font-bold text-black shadow-yellow-bevel transition-all hover:bg-primary-fixed active:translate-y-0.5 active:shadow-none"
      >
        <MessageCircle size={20} />
        Acertar mensalidade (R$ 19,90) via WhatsApp
      </a>

      <button
        type="button"
        onClick={signOut}
        className="mt-4 flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl border border-zinc-border bg-surface-container text-[15px] font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
      >
        <LogOut size={18} />
        Sair da conta
      </button>
    </div>
  );
}