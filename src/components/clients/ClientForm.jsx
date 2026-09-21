import { useState } from 'react';
import { User, Phone, MapPin, FileText, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import { maskPhoneBR, isBRPhone, maskCpf } from '../../utils/formatters';

const EMPTY_FORM = {
  nome: '',
  telefone: '',
  endereco: '',
  cpf: '',
  dataNascimento: '',
};

export default function ClientForm({ initial, saving, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial
      ? {
          nome: initial.nome ?? '',
          telefone: initial.telefone ?? '',
          endereco: initial.endereco ?? '',
          cpf: initial.cpf ?? '',
          dataNascimento: initial.dataNascimento ?? '',
        }
      : EMPTY_FORM
  );
  const [error, setError] = useState('');

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.nome.trim()) {
      setError('Informe o nome do cliente.');
      return;
    }
    if (!isBRPhone(form.telefone)) {
      setError('Informe um telefone válido com DDD.');
      return;
    }
    onSubmit({
      nome: form.nome.trim(),
      telefone: form.telefone.trim(),
      endereco: form.endereco.trim(),
      cpf: form.cpf.trim(),
      dataNascimento: form.dataNascimento,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? <Alert tone="error">{error}</Alert> : null}

      <Input
        label="Nome *"
        placeholder="Ex: Maria da Silva"
        icon={User}
        value={form.nome}
        onChange={(event) => setField('nome', event.target.value)}
      />

      <Input
        label="Telefone (WhatsApp) *"
        type="tel"
        inputMode="tel"
        placeholder="(21) 99999-9999"
        maxLength={15}
        icon={Phone}
        value={form.telefone}
        onChange={(event) => setField('telefone', maskPhoneBR(event.target.value))}
      />

      <Input
        label="Endereço"
        placeholder="Rua, número, bairro"
        icon={MapPin}
        value={form.endereco}
        onChange={(event) => setField('endereco', event.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="CPF"
          placeholder="000.000.000-00"
          maxLength={14}
          icon={FileText}
          value={form.cpf}
          onChange={(event) => setField('cpf', maskCpf(event.target.value))}
        />
        <Input
          label="Nascimento"
          type="date"
          icon={Calendar}
          value={form.dataNascimento}
          onChange={(event) => setField('dataNascimento', event.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving} className="flex-1">
          {initial ? 'Salvar alterações' : 'Cadastrar cliente'}
        </Button>
      </div>
    </form>
  );
}