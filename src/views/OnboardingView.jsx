import { useState } from 'react';
import { Hammer, Phone, ShieldCheck, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { maskPhoneBR, isBRPhone } from '../utils/formatters';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';

export default function OnboardingView() {
  const { completeOnboarding, signOut } = useAuth();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!isBRPhone(phone)) {
      setError('Informe um número de WhatsApp válido (DDD + número).');
      return;
    }

    setLoading(true);
    try {
      await completeOnboarding({ telefone: phone });
    } catch (err) {
      if (err.code === 'phone-already-in-use') {
        setError(
          'Este número de WhatsApp já está vinculado a outra conta. Um número só pode ativar um trial (regra antifraude).'
        );
      } else if (err.code === 'user-not-authorized') {
        setError('Sessão expirada. Faça login novamente para continuar.');
      } else {
        setError(
          'Não foi possível ativar o trial. Verifique sua conexão e tente novamente.'
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-zinc-dark px-6 py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-container text-on-primary-container shadow-yellow-bevel">
            <Hammer size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide text-primary-container">
              Ative seu Trial
            </h1>
            <p className="mt-1 text-[15px] font-normal text-on-surface-variant">
              Falta pouco para liberar seus 30 dias grátis
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-zinc-border bg-surface-container p-6"
        >
          <h2 className="text-base font-bold uppercase tracking-wide text-on-surface">
            Número de WhatsApp
          </h2>

          {error ? <Alert tone="error">{error}</Alert> : null}

          <Input
            label="Telefone (WhatsApp)"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(21) 99999-9999"
            maxLength={15}
            icon={Phone}
            value={phone}
            onChange={(event) => setPhone(maskPhoneBR(event.target.value))}
          />

          <Button type="submit" loading={loading} className="w-full">
            Ativar trial grátis
          </Button>

          <div className="space-y-2 border-t border-zinc-border pt-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <ShieldCheck size={20} className="shrink-0 text-primary-container" />
              <span className="text-[15px]">Número único por conta — 1 telefone = 1 trial</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Clock size={20} className="shrink-0 text-primary-container" />
              <span className="text-[15px]">Acesso total liberado por 30 dias</span>
            </div>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <LogOut size={18} />
            Trocar de conta
          </button>
        </div>
      </div>
    </div>
  );
}