import { useEffect, useState } from 'react';
import { Radar, MapPin, MessageCircleWarning } from 'lucide-react';
import {
  streamOportunidadesDisponiveis,
  extractMissingIndexUrl,
} from '../services/opportunitiesService';
import { ADMIN_WHATSAPP } from '../config/admin';
import { formatBRL, formatRelativeTime } from '../utils/formatters';

function RadarSkeleton({ count = 4 }) {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Carregando oportunidades">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-xl border border-zinc-border bg-surface-container p-4"
        >
          <div className="h-8 w-40 animate-pulse rounded-md bg-surface-container-highest" />
          <div className="h-5 w-3/4 animate-pulse rounded-md bg-surface-container-highest" />
          <div className="h-5 w-1/2 animate-pulse rounded-md bg-surface-container-highest" />
          <div className="h-14 animate-pulse rounded-lg bg-surface-container-highest" />
        </div>
      ))}
    </div>
  );
}

const BETA_BADGE = 'bg-primary-container text-black';

export default function RadarView() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [indexError, setIndexError] = useState(null);

  useEffect(() => {
    const unsubscribe = streamOportunidadesDisponiveis(
      (itens) => {
        setVagas(itens);
        setIndexError(null);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        const indexUrl = extractMissingIndexUrl(error);
        if (indexUrl) {
          console.warn(
            `[Radar] Indice composto necessario. Crie em: ${indexUrl}`
          );
          setIndexError(indexUrl);
        } else if (error?.code !== 'permission-denied') {
          console.warn('[Radar] Falha ao buscar oportunidades:', error.code || error.message);
        }
      }
    );
    return unsubscribe;
  }, []);

  function handleInterest(vaga) {
    const mensagem = `Olá, tenho interesse na vaga: *${vaga.titulo}* (ID: ${vaga.id})`;
    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const semWhatsapp = ADMIN_WHATSAPP === '';

  return (
    <section className="flex flex-col gap-4 pb-8">
      <div className="flex items-center gap-2">
        <Radar size={20} className="text-primary-container" />
        <h2 className="text-base font-semibold text-on-surface">Radar de oportunidades</h2>
      </div>

      <p className="text-[15px] text-on-surface-variant">
        Vagas de montagem publicadas pelo administrador, em tempo real. Toque no botão para
        manifestar interesse direto no WhatsApp.
      </p>

      {loading ? (
        <RadarSkeleton />
      ) : indexError ? (
        <div className="flex flex-col gap-3 rounded-xl border border-error/40 bg-error-container/40 p-4 text-[15px] text-on-surface">
          <p className="flex items-center gap-2 font-semibold text-error">
            <MessageCircleWarning size={20} />
            Índice composto obrigatório
          </p>
          <p>
            O Firestore pede um índice composto ({'status'} + {'createdAt'}) para este Radar. No
            console do Firebase, crie-o usando o link abaixo e recarregue:
          </p>
          <a
            href={indexError}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all rounded-lg bg-primary-container px-4 py-3 text-center font-mono text-[15px] font-bold text-on-primary-container"
          >
            {indexError}
          </a>
        </div>
      ) : vagas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-border bg-surface-container/40 px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
            <Radar size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-base font-bold tracking-wide text-on-surface">
              Nenhuma oportunidade disponível
            </p>
            <p className="mt-1 text-[15px] font-normal text-on-surface-variant">
             Quando o administrador publicar vagas, elas aparecem aqui automaticamente.
            </p>
          </div>
        </div>
      ) : (
        vagas.map((vaga) => {
          return (
            <article
              key={vaga.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-border bg-surface-container p-4"
            >
              <span className="self-start rounded-md bg-primary-container px-2 py-1 text-xs font-bold tracking-wide text-black">
                RECURSO BETA
              </span>

              <div>
                <h3 className="text-[17px] font-bold text-on-surface">{vaga.titulo}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-on-surface-variant">
                  {vaga.cidadeUf ? (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} className="shrink-0" />
                      {vaga.cidadeUf}
                    </span>
                  ) : null}
                  <span>{formatRelativeTime(vaga.createdAt)}</span>
                </div>
              </div>

              {vaga.imageUrl ? (
                <figure className="overflow-hidden rounded-lg border border-zinc-border bg-surface-container-high">
                  <img
                    src={vaga.imageUrl}
                    alt={`Foto da vaga ${vaga.titulo}`}
                    loading="lazy"
                    className="h-56 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                </figure>
              ) : null}

              {vaga.descricao ? (
                <p className="text-[15px] leading-relaxed text-on-surface-variant">
                  {vaga.descricao}
                </p>
              ) : null}

              <div className="flex items-center justify-between gap-2">
                <span className="text-[15px] font-semibold text-on-surface-variant">
                  Valor estimado
                </span>
                <span className="font-mono text-2xl font-extrabold tracking-tight text-primary-container">
                  {formatBRL(vaga.valorEstimado)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleInterest(vaga)}
                disabled={semWhatsapp}
                aria-label={`Tenho interesse na vaga ${vaga.titulo} via WhatsApp`}
                className={`flex h-14 w-full items-center justify-center gap-2 rounded-lg text-[15px] font-bold transition-all ${
                  semWhatsapp
                    ? 'cursor-not-allowed bg-surface-container-high text-on-surface-variant opacity-50'
                    : 'bg-primary-container text-black shadow-yellow-bevel hover:bg-primary-fixed active:translate-y-0.5 active:shadow-none'
                }`}
              >
                Tenho interesse (WhatsApp)
              </button>
            </article>
          );
        })
      )}
    </section>
  );
}