import { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { parseBRLtoNumber, toISODate } from '../../utils/formatters';
import { useAppData } from '../../context/AppDataContext';

const CATEGORIAS = {
  entrada: ['Antecipação', 'Depósito', 'Adiantamento', 'Comissão', 'Outros'],
  saida: [
    'Peças',
    'Ferramentas',
    'Combustível',
    'Transporte',
    'Alimentação',
    'Material',
    'Outros',
  ],
};

export default function TransactionModal({ open, tipo = 'entrada', onClose, onSubmit }) {
  const { privacidade } = useAppData();
  const isSaida = tipo === 'saida';
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const numero = parseBRLtoNumber(valor);
    if (numero <= 0) {
      setError('Informe um valor maior que zero.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSubmit({
        descricao: descricao.trim(),
        categoria: categoria.trim(),
        valor: numero,
        data: toISODate(),
      });
      setValor('');
      setCategoria('');
      setDescricao('');
      onClose();
    } catch {
      setError('Falha ao salvar o lançamento. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!saving) onClose();
      }}
      title={isSaida ? 'Saída / Despesa' : 'Entrada avulsa'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error ? <Alert tone="error">{error}</Alert> : null}

        <div className="flex items-center gap-2">
          {isSaida ? (
            <ArrowDownCircle size={22} className="shrink-0 text-error" />
          ) : (
            <ArrowUpCircle size={22} className="shrink-0 text-tertiary" />
          )}
          <span className={`text-[15px] font-semibold ${isSaida ? 'text-error' : 'text-tertiary'}`}>
            {isSaida ? 'Lançando uma despesa' : 'Lançando uma entrada'}
          </span>
        </div>

        <Input
          label="Valor (R$) *"
          prefix="R$"
          inputMode="decimal"
          autoFocus
          placeholder={privacidade ? 'R$ ***' : '0,00'}
          value={privacidade ? '' : valor}
          onChange={(event) => setValor(event.target.value)}
          disabled={privacidade}
        />

        <label className="block w-full">
          <span className="mb-1 block text-xs font-semibold tracking-wide text-on-surface-variant">
            Categoria
          </span>
          <input
            list={`modal-categorias-${tipo}`}
            placeholder="Ex: Peças, combustível, antecipação..."
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
            className="h-14 w-full rounded-lg border border-zinc-border bg-surface-container px-4 text-[15px] font-normal text-on-surface placeholder:text-on-surface-variant/60 outline-none transition-colors focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
          />
          <datalist id={`modal-categorias-${tipo}`}>
            {(CATEGORIAS[tipo] || []).map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </label>

        <Input
          label="Descrição"
          placeholder={isSaida ? 'Ex: Kit parafusos, frete' : 'Ex: Depósito do cliente'}
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={saving}
            variant={isSaida ? 'danger' : 'primary'}
            className={isSaida ? 'bg-error text-on-error shadow-red-bevel hover:bg-[#DC2626]' : ''}
          >
            {isSaida ? 'Lançar saída' : 'Lançar entrada'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}