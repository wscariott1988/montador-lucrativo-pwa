import { useState } from 'react';
import { Hammer, Mail, Lock, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resetPassword } from '../services/authService';
import { getAuthErrorMessage } from '../utils/errors';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';

export default function LoginView() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const isSignUp = mode === 'signup';

  function toggleMode(nextMode) {
    setMode(nextMode);
    setNotice(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice(null);

    if (!email.trim() || !password) {
      setNotice({ tone: 'error', message: 'Preencha e-mail e senha.' });
      return;
    }
    if (password.length < 6) {
      setNotice({ tone: 'error', message: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
    } catch (err) {
      setNotice({ tone: 'error', message: getAuthErrorMessage(err.code || err.message) });
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setNotice(null);

    if (!email.trim() || !/.+@.+\..+/.test(email.trim())) {
      setNotice({ tone: 'error', message: 'Informe seu e-mail primeiro para redefinir a senha.' });
      return;
    }

    setResetting(true);
    try {
      await resetPassword(email.trim());
      setNotice({
        tone: 'success',
        message: 'Link de redefinição enviado. Verifique sua caixa de entrada.',
      });
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setNotice({
          tone: 'success',
          message: 'Se o e-mail estiver cadastrado, o link de redefinição foi enviado.',
        });
      } else {
        setNotice({ tone: 'error', message: getAuthErrorMessage(err.code || err.message) });
      }
    } finally {
      setResetting(false);
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
              Montador Lucrativo
            </h1>
            <p className="mt-1 text-[15px] font-normal text-on-surface-variant">
              Gestão de campo e precificação inteligente
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-zinc-border bg-surface-container p-6"
        >
          <h2 className="text-base font-bold tracking-wide text-on-surface">
            {isSignUp ? 'Criar conta' : 'Entrar'}
          </h2>

          {notice ? <Alert tone={notice.tone}>{notice.message}</Alert> : null}

          <Input
            label="E-mail"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="seu@email.com"
            icon={Mail}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            inputMode="text"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            rightSlot={
              <button
                type="button"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setShowPassword((v) => !v)}
                className="text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />

          {!isSignUp ? (
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={resetting}
              className="inline-flex min-h-[44px] items-center justify-end gap-1.5 self-end text-[15px] font-semibold text-primary-container underline-offset-4 transition-colors hover:underline disabled:opacity-60"
            >
              <KeyRound size={17} />
              {resetting ? 'Enviando...' : 'Esqueci minha senha'}
            </button>
          ) : null}

          <Button type="submit" loading={loading} className="w-full">
            {isSignUp ? 'Criar conta grátis' : 'Entrar'}
          </Button>

          <div className="flex items-center justify-center gap-4 pt-1">
            {isSignUp ? (
              <button
                type="button"
                onClick={() => toggleMode('signin')}
                className="text-[15px] font-semibold text-primary-container underline-offset-4 hover:underline"
              >
                Já tenho conta — entrar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => toggleMode('signup')}
                className="text-[15px] font-semibold text-primary-container underline-offset-4 hover:underline"
              >
                Não tenho conta — criar agora
              </button>
            )}
          </div>
        </form>

        <div className="flex items-start gap-2 rounded-lg border border-primary-container/30 bg-primary-container/10 px-4 py-3">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary-container" />
          <p className="text-[15px] leading-snug text-on-surface">
            Trial grátis de <strong className="text-primary-container">30 dias</strong> de acesso
            total. Sem cartão de crédito.
          </p>
        </div>
      </div>
    </div>
  );
}