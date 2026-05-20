import BalanceCard from './BalanceCard';

function FinancialSummary() {

  // DATOS SIMULADOS
    const balance = 15000;
    const ingresos = 25000;
    const gastos = 10000;

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