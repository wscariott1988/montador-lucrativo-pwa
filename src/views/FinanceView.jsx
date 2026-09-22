import { useMemo, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFinancePeriod } from '../hooks/useFinancePeriod';
import { periodISO, yearISO, addDespesa, addReceitaAvulsa, deleteDespesa, deleteReceita } from '../services/financeService';
import MeiPanel from '../components/finance/MeiPanel';
import MonthSelector from '../components/finance/MonthSelector';
import MonthBalance from '../components/finance/MonthBalance';
import MetaPanel from '../components/finance/MetaPanel';
import ObligationsGov from '../components/finance/ObligationsGov';
import TransactionModal from '../components/finance/TransactionModal';
import TransactionsList from '../components/finance/TransactionsList';

export default function FinanceView() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;

  const [mesAno, setMesAno] = useState({ ano: anoAtual, mes: mesAtual });
  const [modalTipo, setModalTipo] = useState(null);

  const period = useMemo(() => periodISO(mesAno.ano, mesAno.mes), [mesAno]);
  const yearPeriod = useMemo(() => yearISO(anoAtual), [anoAtual]);

  const mes = useFinancePeriod(uid, period);
  const ano = useFinancePeriod(uid, yearPeriod);

  function mudarMes(delta) {
    setMesAno(({ ano, mes }) => {
      const date = new Date(ano, mes - 1 + delta, 1);
      return { ano: date.getFullYear(), mes: date.getMonth() + 1 };
    });
  }

  const canGoNext = mesAno.ano < anoAtual || (mesAno.ano === anoAtual && mesAno.mes < mesAtual);

  return (
    <section className="flex flex-col gap-5 pb-8">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setModalTipo('entrada')}
          className="flex h-14 items-center justify-center gap-2 rounded-lg bg-tertiary text-on-tertiary text-[15px] font-bold shadow-yellow-bevel transition-all hover:bg-tertiary-container active:translate-y-0.5 active:shadow-none"
        >
          <ArrowUpCircle size={22} strokeWidth={2.5} />
          + Entrada
        </button>
        <button
          type="button"
          onClick={() => setModalTipo('saida')}
          className="flex h-14 items-center justify-center gap-2 rounded-lg bg-error text-on-error text-[15px] font-bold shadow-red-bevel transition-all hover:bg-[#DC2626] active:translate-y-0.5 active:shadow-none"
        >
          <ArrowDownCircle size={22} strokeWidth={2.5} />
          - Saída
        </button>
      </div>

      <MeiPanel total={ano.faturado} year={anoAtual} />

      <MonthSelector
        ano={mesAno.ano}
        mes={mesAno.mes}
        onPrev={() => mudarMes(-1)}
        onNext={() => mudarMes(1)}
        canGoNext={canGoNext}
      />

      <MonthBalance faturado={mes.faturado} saidas={mes.saidas} saldo={mes.saldo} />

      <MetaPanel faturado={mes.faturado} />

      <ObligationsGov />

      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-on-surface">Lançamentos do mês</h3>
        <TransactionsList
          despesas={mes.despesas}
          receitas={mes.receitas}
          onDeleteDespesa={(id) => uid && deleteDespesa(uid, id)}
          onDeleteReceita={(id) => uid && deleteReceita(uid, id)}
        />
      </div>

      <TransactionModal
        open={modalTipo === 'entrada'}
        tipo="entrada"
        onClose={() => setModalTipo(null)}
        onSubmit={(dados) => uid && addReceitaAvulsa(uid, dados)}
      />
      <TransactionModal
        open={modalTipo === 'saida'}
        tipo="saida"
        onClose={() => setModalTipo(null)}
        onSubmit={(dados) => uid && addDespesa(uid, dados)}
      />
    </section>
  );
}