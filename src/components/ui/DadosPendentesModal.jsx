import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Button from './Button';

export default function DadosPendentesModal({ open, pendentes, onClose }) {
  const navigate = useNavigate();
  if (!open || !Array.isArray(pendentes) || pendentes.length === 0) return null;

  return (
    <Modal open={open} onClose={onClose} title="Cadastro incompleto">
      <div className="flex flex-col gap-4">
        <p className="flex items-start gap-2 text-[15px] leading-relaxed text-on-surface">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-error" />
          Para gerar o PDF profissional, complete os dados do seu negócio em Ajustes.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Campos pendentes
          </span>
          {pendentes.map((campo) => (
            <div
              key={campo}
              className="flex items-center gap-2 rounded-lg border border-zinc-border bg-surface-container-high px-4 py-3 text-[15px] font-semibold text-on-surface"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-error" />
              {campo}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={onClose}>
            Agora não
          </Button>
          <Button onClick={() => navigate('/app/ajustes')}>
            Completar Cadastro
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </Modal>
  );
}