import { useEffect, useState } from 'react';
import {
  streamDespesas,
  streamReceitas,
  streamOrcamentosPagos,
} from '../services/financeService';

export function sumBy(records, key = 'valor') {
  return records.reduce((total, record) => total + (Number(record[key]) || 0), 0);
}

// Assina despesas, receitas avulsas e orcamentos pagos de UM periodo (mes ou ano)
// usando consultas filtradas por data (Free Shield). Retorna agregados em tempo real.
export function useFinancePeriod(uid, period) {
  const [despesas, setDespesas] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [orcamentosPagos, setOrcamentosPagos] = useState([]);
  const [loading, setLoading] = useState(uid != null);

  useEffect(() => {
    if (!uid || !period) {
      setDespesas([]);
      setReceitas([]);
      setOrcamentosPagos([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const handleError = (label) => (error) => {
      console.warn(`[Financas] watch ${label} interrompido:`, error.code || error.message);
      setLoading(false);
    };

    const unsubDespesas = streamDespesas(
      uid,
      period,
      (list) => {
        setDespesas(list);
        setLoading(false);
      },
      handleError('despesas')
    );
    const unsubReceitas = streamReceitas(
      uid,
      period,
      (list) => {
        setReceitas(list);
        setLoading(false);
      },
      handleError('receitas')
    );
    const unsubOrcamentos = streamOrcamentosPagos(
      uid,
      period,
      (list) => {
        setOrcamentosPagos(list);
        setLoading(false);
      },
      handleError('orcamentos')
    );

    return () => {
      unsubDespesas();
      unsubReceitas();
      unsubOrcamentos();
    };
  }, [uid, period?.inicio, period?.fim]);

  const receitaOrcamentos = sumBy(orcamentosPagos, 'totalGeral');
  const faturado = sumBy(receitas) + receitaOrcamentos;
  const saidas = sumBy(despesas);

  return {
    despesas,
    receitas,
    orcamentosPagos,
    faturado,
    saidas,
    saldo: faturado - saidas,
    loading,
  };
}