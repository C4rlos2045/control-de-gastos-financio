import BalanceCard from './BalanceCard';

import {
  useFinance
} from '../../context/FinanceContext';

function FinancialSummary() {

  const {
    movimientos
  } = useFinance();

  const ingresos =
    movimientos
      .filter(
        mov => mov.tipo === 'ingreso'
      )
      .reduce(
        (acc, mov) =>
          acc + mov.monto,
        0
      );

  const gastos =
    movimientos
      .filter(
        mov => mov.tipo === 'gasto'
      )
      .reduce(
        (acc, mov) =>
          acc + mov.monto,
        0
      );

  const balance =
    ingresos - gastos;

  return (

    <section className="dashboard__cards">

      <BalanceCard
        titulo="Balance"
        monto={balance}
      />

      <BalanceCard
        titulo="Ingresos"
        monto={ingresos}
      />

      <BalanceCard
        titulo="Gastos"
        monto={gastos}
      />

    </section>
  );
}

export default FinancialSummary;