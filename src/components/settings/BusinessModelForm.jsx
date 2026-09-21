import { useEffect, useRef, useState } from 'react';
import {
  Store,
  Percent,
  Coins,
  PiggyBank,
  TrendingUp,
  Clock3,
  CalendarDays,
  Save,
  CheckCircle2,
  CloudOff,
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAppData } from '../../context/AppDataContext';
import { parseBRLtoNumber } from '../../utils/formatters';

function moneyToDraft(value) {
  if (value == null || Number.isNaN(Number(value))) return '';
  return Number(value).toFixed(2).replace('.', ',');
}

function createDraft(profile) {
  return {
    regime: profile?.regime ?? 'mei',
    valorDas: moneyToDraft(profile?.valorDas),
    impostoPercentual: profile?.impostoPercentual != null ? String(profile.impostoPercentual) : '',
    proLabore: moneyToDraft(profile?.proLabore),
    custosFixos: moneyToDraft(profile?.custosFixos),
    metaLucro: profile?.metaLucro != null ? String(profile.metaLucro) : '',
    horasTrabalhadasDia:
      profile?.horasTrabalhadasDia != null ? String(profile.horasTrabalhadasDia) : '',
    diasTrabalhadosMes:
      profile?.diasTrabalhadosMes != null ? String(profile.diasTrabalhadosMes) : '',
  };
}

export default function BusinessModelForm() {
  const { profile, online, updateProfile } = useAppData();
  const [draft, setDraft] = useState(() => createDraft(profile));
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (profile && !initialized.current) {
      initialized.current = true;
      setDraft(createDraft(profile));
    }
  }, [profile]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const isMei = draft.regime === 'mei';

  function setField(key, value) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        regime: draft.regime,
        valorDas: isMei ? parseBRLtoNumber(draft.valorDas) : 0,
        impostoPercentual: !isMei ? Number(draft.impostoPercentual) || 0 : 0,
        proLabore: parseBRLtoNumber(draft.proLabore),
        custosFixos: parseBRLtoNumber(draft.custosFixos),
        metaLucro: Number(draft.metaLucro) || 0,
        horasTrabalhadasDia: Number(draft.horasTrabalhadasDia) || 0,
        diasTrabalhadosMes: Number(draft.diasTrabalhadosMes) || 0,
      });
      setFeedback(online ? 'saved' : 'offline');
    } catch {
      setFeedback('error');
    } finally {
      setSaving(false);
    }
  }

  function renderFeedback() {
    if (!feedback) return null;
    if (feedback === 'saved') {
      return (
        <div className="flex items-center gap-2 text-tertiary">
          <CheckCircle2 size={20} />
          <span className="text-[15px] font-semibold">Salvo no Firebase</span>
        </div>
      );
    }
    if (feedback === 'offline') {
      return (
        <div className="flex items-center gap-2 text-primary-container">
          <CloudOff size={20} />
          <span className="text-[15px] font-semibold">
            Salvo no aparelho — sincroniza ao reconectar
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-error">
        <CheckCircle2 size={20} />
        <span className="text-[15px] font-semibold">
          Não foi possível salvar. Verifique sua conexão e tente novamente.
        </span>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Store size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold tracking-wide text-on-surface">
          Modelo de negócio
        </h3>
      </div>

      <form
        onSubmit={handleSave}
        className="flex flex-col gap-4 rounded-xl border border-zinc-border bg-surface-container p-4"
      >
        <div>
          <span className="mb-1 block text-xs font-semibold tracking-wide text-on-surface-variant">
            Regime tributário
          </span>
          <div className="grid grid-cols-2 gap-2">
            {['mei', 'simples'].map((regime) => (
              <button
                key={regime}
                type="button"
                onClick={() => setField('regime', regime)}
                className={`h-12 rounded-lg text-[15px] font-bold tracking-wide transition-colors ${
                  draft.regime === regime
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {regime === 'mei' ? 'MEI' : 'Simples'}
              </button>
            ))}
          </div>
        </div>

        {isMei ? (
          <Input
            label="Valor do DAS (R$/mês)"
            prefix="R$"
            inputMode="decimal"
            placeholder="0,00"
            icon={Coins}
            value={draft.valorDas}
            onChange={(event) => setField('valorDas', event.target.value)}
          />
        ) : (
          <Input
            label="Imposto (%)"
            inputMode="decimal"
            placeholder="0"
            icon={Percent}
            value={draft.impostoPercentual}
            onChange={(event) => setField('impostoPercentual', event.target.value)}
          />
        )}

        <Input
          label="Pró-labore (R$/mês)"
          prefix="R$"
          inputMode="decimal"
          placeholder="0,00"
          icon={PiggyBank}
          value={draft.proLabore}
          onChange={(event) => setField('proLabore', event.target.value)}
        />

        <Input
          label="Custos fixos (R$/mês)"
          prefix="R$"
          inputMode="decimal"
          placeholder="0,00"
          icon={Coins}
          value={draft.custosFixos}
          onChange={(event) => setField('custosFixos', event.target.value)}
        />

        <Input
          label="Margem de lucro (%)"
          inputMode="decimal"
          placeholder="0"
          icon={TrendingUp}
          value={draft.metaLucro}
          onChange={(event) => setField('metaLucro', event.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Horas/dia"
            inputMode="numeric"
            placeholder="8"
            icon={Clock3}
            value={draft.horasTrabalhadasDia}
            onChange={(event) => setField('horasTrabalhadasDia', event.target.value)}
          />
          <Input
            label="Dias/mês"
            inputMode="numeric"
            placeholder="22"
            icon={CalendarDays}
            value={draft.diasTrabalhadosMes}
            onChange={(event) => setField('diasTrabalhadosMes', event.target.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-zinc-border pt-4">
          <div className="min-w-0">{renderFeedback()}</div>
          <Button type="submit" size="md" loading={saving} className="shrink-0">
            <Save size={20} />
            Salvar
          </Button>
        </div>
      </form>
    </section>
  );
}