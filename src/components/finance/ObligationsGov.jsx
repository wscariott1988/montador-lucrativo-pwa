import { FileCheck2, ReceiptText } from 'lucide-react';

const LINKS = [
  {
    label: 'Pagar DAS',
    href: 'https://www8.receita.fazenda.gov.br/SimplesNacional/Arrecadacao/Pgmei/',
    icon: ReceiptText,
  },
  {
    label: 'Emitir NFS-e',
    href: 'https://www.nfse.gov.br/EmissorNacional/Login',
    icon: FileCheck2,
  },
];

export default function ObligationsGov() {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-base font-semibold text-on-surface">Links rápidos</h3>
      <div className="grid grid-cols-2 gap-3">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-xl border border-zinc-border bg-surface-container text-[15px] font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
          >
            <link.icon size={22} className="text-secondary" />
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}