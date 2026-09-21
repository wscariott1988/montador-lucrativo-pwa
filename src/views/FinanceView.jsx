import { useMemo, useState } from 'react';
import { Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFinancePeriod } from '../hooks/useFinancePeriod';
import { periodISO, yearISO, addDespesa, addReceitaAvulsa, deleteDespesa, deleteReceita } from '../services/financeService';
import MeiPanel from '../components/finance/MeiPanel';
import MonthSelector from '../components/finance/MonthSelector';
import MonthBalance from '../components/finance/MonthBalance';
import MetaPanel from '../components/finance/MetaPanel';
import ObligationsGov from '../components/finance/ObligationsGov';
import TransactionForm from '../components/finance/TransactionForm';
import TransactionsList from '../components/finance/TransactionsList';

export default function FinanceView() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;

  const [mesAno, setMesAno] = useState({ ano: anoAtual, mes: mesAtual });

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
      <div className="flex items-center gap-2">
        <Wallet size={20} className="text-primary-container" />
        <h2 className="text-base font-semibold text-on-surface">Finanças</h2>
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

      <TransactionForm
        tipo="saida"
        onSubmit={(dados) => uid && addDespesa(uid, dados)}
      />
      <TransactionForm
        tipo="entrada"
        onSubmit={(dados) => uid && addReceitaAvulsa(uid, dados)}
      />

      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-on-surface">Lançamentos do mês</h3>
        <TransactionsList
          despesas={mes.despesas}
          receitas={mes.receitas}
          onDeleteDespesa={(id) => uid && deleteDespesa(uid, id)}
          onDeleteReceita={(id) => uid && deleteReceita(uid, id)}
        />
      </div>
    </section>
  );
}