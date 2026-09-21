import { useMemo, useState } from 'react';
import { Users, Search, UserPlus, UserRound } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import ClientCard from '../components/clients/ClientCard';
import ClientForm from '../components/clients/ClientForm';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';

export default function ClientsView() {
  const { clients, createClient, editClient, removeClient } = useAppData();
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busca, setBusca] = useState('');

  const filtered = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return clients;
    return clients.filter(
      (client) =>
        String(client.nome ?? '').toLowerCase().includes(termo) ||
        String(client.telefone ?? '').includes(busca.trim())
    );
  }, [clients, busca]);

  async function handleSubmit(data) {
    setSaving(true);
    try {
      if (modal?.mode === 'edit') {
        await editClient(modal.client.id, data);
      } else {
        await createClient(data);
      }
      setModal(null);
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(client) {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Remover "${client.nome}"? Essa ação não pode ser desfeita.`)) return;
    removeClient(client.id).catch(() => {
      // eslint-disable-next-line no-alert
      window.alert('Falha ao remover o cliente. Tente novamente.');
    });
  }

  return (
    <section className="flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-primary-container" />
          <h2 className="text-base font-semibold text-on-surface">Clientes</h2>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: 'create' })}
          className="flex h-12 items-center gap-2 rounded-lg bg-surface-container px-4 text-[15px] font-semibold text-primary-container transition-colors hover:bg-surface-container-high"
        >
          <UserPlus size={20} />
          Novo
        </button>
      </div>

      <Input
        icon={Search}
        placeholder="Buscar por nome ou telefone..."
        value={busca}
        onChange={(event) => setBusca(event.target.value)}
      />

      {clients.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="Nenhum cliente ainda"
          description="Toque em Novo e comece sua base de contatos."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Sem resultados"
          description="Nenhum cliente encontrado para essa busca."
        />
      ) : (
        filtered.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={(item) => setModal({ mode: 'edit', client: item })}
            onDelete={confirmDelete}
          />
        ))
      )}

      <Modal
        open={modal != null}
        onClose={() => setModal(null)}
        title={modal?.mode === 'edit' ? 'Editar cliente' : 'Novo cliente'}
      >
        <ClientForm
          initial={modal?.mode === 'edit' ? modal.client : null}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={() => setModal(null)}
        />
      </Modal>
    </section>
  );
}