import { useEffect, useRef, useState } from 'react';
import {
  Store,
  UserRound,
  FileText,
  MapPin,
  ImageUp,
  Trash2,
  Save,
  CheckCircle2,
  CloudOff,
  Loader2,
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import { useAppData } from '../../context/AppDataContext';
import { maskCpf, digitsOnly } from '../../utils/formatters';
import { uploadImageToImgBB, hasImgBbKey } from '../../services/imgbbService';

function maskCnpj(value) {
  const d = digitsOnly(value).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12)
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function maskDocumento(value) {
  const d = digitsOnly(value);
  return d.length <= 11 ? maskCpf(value) : maskCnpj(value);
}

function createDraft(profile) {
  return {
    nomeProfissional: profile?.nomeProfissional ?? profile?.nomeEmpresa ?? '',
    cnpjCpf: profile?.cnpjCpf ?? '',
    cidade: profile?.cidade ?? '',
    logoUrl: profile?.logoUrl ?? '',
  };
}

export default function BusinessDataForm() {
  const { profile, online, updateProfile } = useAppData();
  const [draft, setDraft] = useState(() => createDraft(profile));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const initialized = useRef(false);
  const fileInputRef = useRef(null);

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

  function setField(key, value) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        nomeProfissional: draft.nomeProfissional.trim(),
        cnpjCpf: digitsOnly(draft.cnpjCpf),
        cidade: draft.cidade.trim(),
        logoUrl: draft.logoUrl,
      });
      setFeedback(online ? 'saved' : 'offline');
    } catch {
      setFeedback('error');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadImageToImgBB(file);
      setField('logoUrl', url);
    } catch (error) {
      setUploadError(
        error?.code === 'imgbb-not-configured'
          ? 'Chave da ImgBB não configurada. Adicione VITE_IMGBB_API_KEY no .env.local.'
          : 'Não foi possível enviar a imagem. Tente outro arquivo.'
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
          Dados do negócio
        </h3>
        <span className="ml-auto rounded bg-surface-container-high px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
          usado no PDF
        </span>
      </div>

      <form
        onSubmit={handleSave}
        className="flex flex-col gap-4 rounded-xl border border-zinc-border bg-surface-container p-4"
      >
        <Input
          label="Nome profissional / Empresa *"
          placeholder="Ex: João Montador Serviços"
          icon={UserRound}
          value={draft.nomeProfissional}
          onChange={(event) => setField('nomeProfissional', event.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="CNPJ/CPF *"
            inputMode="numeric"
            maxLength={18}
            placeholder="00.000.000/0000-00"
            icon={FileText}
            value={draft.cnpjCpf}
            onChange={(event) => setField('cnpjCpf', maskDocumento(event.target.value))}
          />
          <Input
            label="Cidade *"
            placeholder="Ex: São Paulo - SP"
            icon={MapPin}
            value={draft.cidade}
            onChange={(event) => setField('cidade', event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-zinc-border bg-surface-container-high p-3">
          <span className="text-xs font-semibold tracking-wide text-on-surface-variant">
            Logotipo (aparece no cabeçalho do PDF) — opcional
          </span>
          {draft.logoUrl ? (
            <div className="flex items-center gap-3">
              <img
                src={draft.logoUrl}
                alt="Logotipo do negócio"
                className="h-14 w-14 rounded object-contain bg-surface"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex flex-1 flex-col gap-1">
                <span className="truncate text-[15px] font-semibold text-on-surface">
                  Logo carregada
                </span>
                <button
                  type="button"
                  onClick={() => setField('logoUrl', '')}
                  className="flex items-center gap-1.5 text-[15px] font-semibold text-error transition-colors hover:text-error/80"
                >
                  <Trash2 size={16} />
                  Remover logo
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoFile}
              />
              {hasImgBbKey() ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  loading={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? null : <ImageUp size={20} />}
                  {uploading ? 'Enviando...' : 'Enviar logo'}
                </Button>
              ) : (
                <p className="text-[13px] font-normal text-on-surface-variant">
                  Upload de logo indisponível: configure a chave da ImgBB (VITE_IMGBB_API_KEY).
                </p>
              )}
              {uploading ? (
                <p className="flex items-center gap-2 text-[15px] font-semibold text-on-surface-variant">
                  <Loader2 size={18} className="animate-spin text-primary-container" />
                  Enviando imagem...
                </p>
              ) : null}
              {uploadError ? <Alert tone="error">{uploadError}</Alert> : null}
            </div>
          )}
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