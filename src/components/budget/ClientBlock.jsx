import { useMemo, useState } from 'react';
import { UserRound, Search, MapPin, CalendarDays, Timer, Car, X } from 'lucide-react';
import Input from '../ui/Input';

export default function ClientBlock({
  clients = [],
  cliente,
  onChange,
  onSelectClient,
  onClearClient,
  idPrefix,
}) {
  const [busca, setBusca] = useState('');
  const [focused, setFocused] = useState(false);

  const resultados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return [];
    return clients
      .filter(
        (client) =>
          String(client.nome ?? '').toLowerCase().includes(termo) ||
          String(client.telefone ?? '').includes(busca.trim())
      )
      .slice(0, 5);
  }, [clients, busca]);

  function handleSelect(client) {
    onSelectClient(client);
    setBusca('');
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <UserRound size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold tracking-wide text-on-surface">Dados do cliente</h3>
      </div>

      <div className="relative">
        <Input
          id={`${idPrefix}-busca-cliente`}
          icon={Search}
          placeholder="Buscar cliente cadastrado..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
        />
        {focused && resultados.length > 0 ? (
          <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-zinc-border bg-surface-container-high shadow-dewalt-bevel">
            {resultados.map((client) => (
              <button
                key={client.id}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelect(client);
                }}
                className="flex min-h-[48px] w-full items-center gap-3 px-4 text-left transition-colors hover:bg-primary-container hover:text-on-primary-container"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest text-[15px] font-extrabold">
                  {String(client.nome ?? '?').slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-on-surface">
                    {client.nome}
                  </p>
                  <p className="truncate text-[15px] text-on-surface-variant">{client.telefone}</p>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {cliente.id ? (
        <div className="flex items-center gap-2 rounded-xl border border-primary-container/50 bg-primary-container/10 px-4 py-3">
          <UserRound size={20} className="shrink-0 text-primary-container" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-on-surface">{cliente.nome}</p>
            {cliente.telefone ? (
              <p className="truncate text-[15px] text-on-surface-variant">{cliente.telefone}</p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Limpar cliente selecionado"
            onClick={onClearClient}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:text-error"
          >
            <X size={22} />
          </button>
        </div>
      ) : null}

      <Input
        id={`${idPrefix}-cliente-nome`}
        label="Nome (preenchimento avulso)"
        placeholder="Ex: Maria da Silva"
        icon={UserRound}
        value={cliente.nome}
        onChange={(event) => onChange('nome', event.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id={`${idPrefix}-cliente-cidade`}
          label="Cidade"
          placeholder="São Paulo"
          icon={MapPin}
          value={cliente.cidade}
          onChange={(event) => onChange('cidade', event.target.value)}
        />
        <Input
          id={`${idPrefix}-cliente-data`}
          label="Data da Montagem"
          type="date"
          icon={CalendarDays}
          value={cliente.dataServico}
          onChange={(event) => onChange('dataServico', event.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id={`${idPrefix}-cliente-validade`}
          label="Validade (dias)"
          inputMode="numeric"
          placeholder="7"
          icon={Timer}
          value={cliente.validadeDias}
          onChange={(event) => onChange('validadeDias', event.target.value.replace(/[^\d]/g, ''))}
        />
        <Input
          id={`${idPrefix}-cliente-deslocamento`}
          label="Deslocamento (R$)"
          prefix="R$"
          inputMode="decimal"
          placeholder="0,00"
          icon={Car}
          value={cliente.deslocamento}
          onChange={(event) => onChange('deslocamento', event.target.value.replace(/[^\d.,]/g, ''))}
        />
      </div>
    </section>
  );
}