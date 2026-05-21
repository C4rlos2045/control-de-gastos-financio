import DashboardHeader from '../components/dashboard/DashboardHeader';
import FinancialSummary from '../components/dashboard/FinancialSummary';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import MovementTable from '../components/dashboard/MovementTable';
import ExpenseForm from '../components/forms/ExpenseForms';
import ExpenseFilter from '../components/dashboard/ExpenseFilters';

import {useState} from 'react';

function Dashboard() {
  const [filtroTexto, setFiltroTexto] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  return (

    <main className="dashboard">
      <DashboardHeader />
      <FinancialSummary />
      <ExpenseForm />
      <ExpenseFilter
        filtroTexto={filtroTexto}
        setFiltroTexto={setFiltroTexto}
        categoriaSeleccionada={categoriaSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
      />
      <ExpenseChart
        filtroTexto={filtroTexto}

        categoriaSeleccionada={
        categoriaSeleccionada
        }
      />
      <MovementTable />
    </main>
  );
}

export default Dashboard;