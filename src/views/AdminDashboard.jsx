import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Megaphone,
  Layers,
  Loader2,
  PhoneCall,
  MapPin,
  Search,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isAdminEmail } from '../config/admin';
import {
  fetchUsersAdmin,
  postOportunidadeAdmin,
  fetchOportunidadesAdmin,
  setOportunidadeStatusAdmin,
} from '../services/opportunitiesService';
import { formatBRL, formatDateTimeBR, formatRelativeTime, digitsOnly } from '../utils/formatters';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const TABS = [
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'postar', label: 'Postar Vaga', icon: Megaphone },
  { id: 'vagas', label: 'Vagas Ativas', icon: Layers },
];

const VAGA_STATUS_META = {
  disponivel: { label: 'Disponível', className: 'bg-tertiary/20 text-tertiary' },
  atribuido: { label: 'Atribuída', className: 'bg-on-surface/15 text-on-surface-variant' },
  cancelado: { label: 'Cancelada', className: 'bg-error/15 text-error' },
};

function Tabs({ active, onChange }) {
  return (
    <div className="sticky top-16 z-40 -mx-4 flex gap-1 border-b border-zinc-border bg-zinc-dark/95 px-4 pt-3 pb-2 backdrop-blur-xl">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-lg text-[15px] font-bold transition-colors ${
            active === id
              ? 'bg-primary-container text-black'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </div>
  );
}

function CrmTab({ online }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  function load() {
    setLoading(true);
    fetchUsersAdmin()
      .then(setUsers)
      .catch((error) => {
        console.warn('[Admin/CRM]', error.code || error.message);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl bg-surface-container" />
        ))}
      </div>
    );
  }

  const termo = busca.trim().toLowerCase();
  const filtered = termo
    ? users.filter(
        (u) =>
          String(u.email ?? '').toLowerCase().includes(termo) ||
          String(u.nomeEmpresa ?? u.nome ?? '').toLowerCase().includes(termo)
      )
    : users;

  return (
    <section className="flex flex-col gap-4 pb-8">
      <Input
        icon={Search}
        placeholder="Buscar por nome ou e-mail..."
        value={busca}
        onChange={(event) => setBusca(event.target.value)}
      />

      {!online ? (
        <p className="text-[15px] text-on-surface-variant">
          Sem conexão — o CRM precisa de internet para carregar os usuários.
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <p className="rounded-lg bg-surface-container px-4 py-6 text-center text-[15px] text-on-surface-variant">
          Nenhum usuário encontrado.
        </p>
      ) : (
        filtered.map((usuario) => {
          const telefoneDigits = digitsOnly(usuario.telefone);
          const telComCc =
            telefoneDigits.length >= 12 ? telefoneDigits : `55${telefoneDigits}`;
          return (
            <article
              key={usuario.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-border bg-surface-container p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
                  <span className="text-[15px] font-extrabold">
                    {String(usuario.nomeEmpresa ?? usuario.nome ?? '?').slice(0, 1)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-on-surface">
                    {usuario.nomeEmpresa || 'Montador'}
                  </p>
                  <p className="truncate text-[15px] text-on-surface-variant">{usuario.email}</p>
                </div>
                <a
                  href={telefoneDigits ? `https://wa.me/${telComCc}` : undefined}
                  target={telefoneDigits ? '_blank' : undefined}
                  rel={telefoneDigits ? 'noopener noreferrer' : undefined}
                  aria-label={`Chamar ${usuario.email || 'usuário'} no WhatsApp`}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-tertiary text-on-tertiary transition-all active:translate-y-0.5"
                >
                  <PhoneCall size={20} />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-on-surface-variant">
                <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-bold">
                  {(usuario.plano || 'trial').toUpperCase()}
                </span>
                <span className="font-mono">{usuario.telefone || '—'}</span>
                <span>Cadastro: {formatDateTimeBR(usuario.createdAt) || '—'}</span>
              </div>
            </article>
          );
        })
      )}
    </section>
  );
}

function PostarVagaTab({ onPosted }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cidadeUf, setCidadeUf] = useState('');
  const [valorEstimado, setValorEstimado] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disabled = !titulo.trim() || !cidadeUf.trim() || Number(valorEstimado.replace(',', '.')) <= 0;

  async function handleSubmit(event) {
    event.preventDefault();
    if (disabled || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await postOportunidadeAdmin({
        titulo,
        descricao,
        cidadeUf,
        valorEstimado: Number(valorEstimado.replace(',', '.')),
      });
      setTitulo('');
      setDescricao('');
      setCidadeUf('');
      setValorEstimado('');
      onPosted({ tone: 'success', message: 'Oportunidade publicada no Radar!' });
    } catch (error) {
      console.warn('[Admin/Postar]', error.code || error.message);
      onPosted({ tone: 'error', message: 'Não foi possível publicar. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-8">
      <Input
        label="Título *"
        placeholder="Ex: Montagem de guarda-roupa planejado"
        value={titulo}
        onChange={(event) => setTitulo(event.target.value)}
      />
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wide text-on-surface-variant">
          Descrição
        </span>
        <textarea
          rows={4}
          placeholder="Descreva o escopo, número de peças, andar, etc."
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          className="w-full min-h-14 resize-none rounded-lg border border-zinc-border bg-surface-container px-4 py-3 text-[15px] text-on-surface placeholder:text-on-surface-variant/60 outline-none transition-colors focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
        />
      </label>
      <Input
        label="Cidade / UF *"
        placeholder="Ex: São Paulo - SP"
        icon={MapPin}
        value={cidadeUf}
        onChange={(event) => setCidadeUf(event.target.value)}
      />
      <Input
        label="Valor estimado (R$) *"
        prefix="R$"
        inputMode="decimal"
        placeholder="0,00"
        value={valorEstimado}
        onChange={(event) => setValorEstimado(event.target.value)}
      />

      <button
        type="submit"
        disabled={disabled || isSubmitting}
        className="flex h-14 items-center justify-center gap-2 rounded-lg bg-primary-container font-bold text-black shadow-yellow-bevel transition-all hover:bg-primary-fixed active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Publicando...
          </>
        ) : (
          <>
            <Megaphone size={20} />
            Publicar no Radar
          </>
        )}
      </button>
    </form>
  );
}

function VagasAtivasTab({ onChanged }) {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(null);

  function load() {
    setLoading(true);
    fetchOportunidadesAdmin()
      .then(setVagas)
      .catch((error) => {
        console.warn('[Admin/Vagas]', error.code || error.message);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleStatusChange(vaga, novoStatus) {
    if (isUpdating) return;
    setIsUpdating(vaga.id);
    try {
      await setOportunidadeStatusAdmin(vaga.id, novoStatus);
      setVagas((prev) =>
        prev.map((item) => (item.id === vaga.id ? { ...item, status: novoStatus } : item))
      );
      onChanged({
        tone: 'success',
        message: novoStatus === 'atribuido' ? 'Vaga marcada como atribuída.' : 'Vaga cancelada.',
      });
    } catch (error) {
      console.warn('[Admin/Vagas]', error.code || error.message);
      onChanged({ tone: 'error', message: 'Não foi possível alterar o status.' });
    } finally {
      setIsUpdating(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl bg-surface-container" />
        ))}
      </div>
    );
  }

  if (vagas.length === 0) {
    return (
      <p className="rounded-lg bg-surface-container px-4 py-6 text-center text-[15px] text-on-surface-variant">
        Nenhuma vaga publicada ainda.
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-3 pb-8">
      {vagas.map((vaga) => {
        const meta = VAGA_STATUS_META[vaga.status] || VAGA_STATUS_META.disponivel;
        const updating = isUpdating === vaga.id;
        const marcouNao = vaga.status === 'cancelado';
        return (
          <article
            key={vaga.id}
            className="flex flex-col gap-3 rounded-xl border border-zinc-border bg-surface-container p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-[15px] font-bold text-on-surface">{vaga.titulo}</h3>
                <p className="mt-1 text-[15px] text-on-surface-variant">
                  {vaga.cidadeUf} · {formatRelativeTime(vaga.createdAt)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${meta.className}`}
              >
                {meta.label}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-lg font-extrabold text-primary-container">
                {formatBRL(vaga.valorEstimado)}
              </span>
              <span className="font-mono text-[15px] text-on-surface-variant">
                {formatDateTimeBR(vaga.createdAt) || '—'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={updating || vaga.status === 'atribuido'}
                onClick={() => handleStatusChange(vaga, 'atribuido')}
                className="flex h-14 items-center justify-center gap-2 rounded-lg bg-tertiary/10 text-[15px] font-bold text-tertiary transition-colors hover:bg-tertiary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating ? <Loader2 size={20} className="animate-spin" /> : null}
                Marcar como Atribuída
              </button>
              <button
                type="button"
                disabled={updating || marcouNao}
                onClick={() => handleStatusChange(vaga, 'cancelado')}
                className="flex h-14 items-center justify-center gap-2 rounded-lg bg-error-container/50 text-[15px] font-bold text-error transition-colors hover:bg-error/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating ? <Loader2 size={20} className="animate-spin" /> : null}
                Cancelar Vaga
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [active, setActive] = useState('crm');
  const [toast, setToast] = useState(null);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  // Blindagem: somente o e-mail admin (VITE_ADMIN_EMAIL) acessa o painel.
  if (!user || !isAdminEmail(user.email)) {
    return <Navigate to="/app" replace />;
  }

  return (
    <section className="min-h-screen flex-col bg-zinc-dark pb-8">
      <header className="bg-surface-container px-4 pt-safe pb-3">
        <div className="flex h-16 items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container text-black">
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-bold leading-none text-on-surface">
                Painel Admin
              </span>
              <span className="mt-0.5 text-[13px] text-on-surface-variant">{user.email}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            aria-label="Sair"
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
          >
            <LogOut size={22} />
          </button>
        </div>
        {!online ? (
          <p className="rounded-lg border border-error/40 bg-error-container/40 px-3 py-2 text-[15px] font-semibold text-error">
            Offline — a sincronização depende de conexão no painel admin.
          </p>
        ) : null}
      </header>

      <div className="px-4">
        <Tabs active={active} onChange={setActive} />

        {active === 'crm' ? <CrmTab online={online} /> : null}
        {active === 'postar' ? (
          <PostarVagaTab onPosted={setToast} />
        ) : null}
        {active === 'vagas' ? <VagasAtivasTab onChanged={setToast} /> : null}
      </div>

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </section>
  );
}