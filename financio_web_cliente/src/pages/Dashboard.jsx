import DashboardHeader from '../components/dashboard/DashboardHeader';
import FinancialSummary from '../components/dashboard/FinancialSummary';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import MovementTable from '../components/dashboard/MovementTable';
import ExpenseForm from '../components/forms/ExpenseForms';
import ExpenseFilter from '../components/dashboard/ExpenseFilters';
import AIRecomendatios from '../components/ia/AIRecomendatios';
import AnalisisLogicoFinanciero from '../components/dashboard/AnalisisLogicoFinanciero';

import {useState} from 'react';

function Dashboard() {
  const [filtroTexto, setFiltroTexto] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');

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
        tipoSeleccionado={tipoSeleccionado}
        setTipoSeleccionado={setTipoSeleccionado}
      />
      <ExpenseChart
        filtroTexto={filtroTexto}
        categoriaSeleccionada={categoriaSeleccionada}
        tipoSeleccionado={tipoSeleccionado}
      />
      <AnalisisLogicoFinanciero />
      <AIRecomendatios />
      <MovementTable />
    </main>
  );
}

export default Dashboard;
