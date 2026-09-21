import { Search, MapPin, CalendarDays, Truck, UserSearch } from 'lucide-react';
import Input from '../ui/Input';
import { toISODate } from '../../utils/formatters';
import { useAppData } from '../../context/AppDataContext';

export default function ClientSection({
  clients,
  clienteBusca,
  onClienteBusca,
  clienteSelected,
  onClienteSelected,
  cidade,
  onCidade,
  dataServico,
  onDataServico,
  validadeDias,
  onValidade,
  deslocamento,
  onDeslocamento,
}) {
  const { privacidade } = useAppData();
  const termo = clienteBusca.trim().toLowerCase();
  const sugestoes = termo
    ? clients
        .filter(
          (client) =>
            String(client.nome ?? '').toLowerCase().includes(termo) ||
            String(client.telefone ?? '').includes(clienteBusca.trim())
        )
        .slice(0, 5)
    : [];

  function selectClient(client) {
    onClienteSelected(client);
    onClienteBusca(client.nome);
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <UserSearch size={20} className="text-primary-container" />
        <h3 className="text-base font-semibold text-on-surface">Dados do cliente</h3>
      </div>

      <div className="relative">
        <Input
          label="Nome (busque ou digite)"
          placeholder="Buscar cliente ou digitar manualmente"
          icon={Search}
          value={clienteBusca}
          onChange={(event) => {
            onClienteBusca(event.target.value);
            if (clienteSelected && event.target.value !== clienteSelected.nome) {
              onClienteSelected(null);
            }
          }}
        />
        {sugestoes.length > 0 ? (
          <div className="absolute inset-x-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-lg border border-zinc-border bg-surface-container-high shadow-dewalt-bevel">
            {sugestoes.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => selectClient(client)}
                className="flex min-h-[48px] w-full items-center justify-between px-4 text-left text-[15px] text-on-surface transition-colors hover:bg-surface-container-highest"
              >
                <span className="truncate font-semibold">{client.nome}</span>
                <span className="font-mono text-[15px] text-on-surface-variant">
                  {client.telefone}
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {clienteSelected ? (
        <p className="flex items-center gap-2 text-[15px] text-tertiary">
          <Search size={16} />
          Cliente da base selecionado
        </p>
      ) : null}

      <Input
        label="Cidade"
        placeholder="Ex: São Paulo - SP"
        icon={MapPin}
        value={cidade}
        onChange={(event) => onCidade(event.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Data da montagem"
          type="date"
          icon={CalendarDays}
          value={dataServico}
          onChange={(event) => onDataServico(event.target.value || toISODate())}
        />
        <Input
          label="Validade (dias)"
          inputMode="numeric"
          icon={Truck}
          value={validadeDias}
          onChange={(event) => onValidade(event.target.value)}
        />
      </div>

      <Input
        label="Deslocamento (R$)"
        prefix="R$"
        inputMode="decimal"
        placeholder={privacidade ? 'R$ ***' : '0,00'}
        icon={Truck}
        value={privacidade ? '' : deslocamento}
        onChange={(event) => onDeslocamento(event.target.value)}
        disabled={privacidade}
      />
    </section>
  );
}