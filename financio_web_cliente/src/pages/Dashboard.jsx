import DashboardHeader from '../components/dashboard/DashboardHeader';
import FinancialSummary from '../components/dashboard/FinancialSummary';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import MovementTable from '../components/dashboard/MovementTable';
import QuickActions from '../components/dashboard/QuickActions';

function Dashboard() {
  return (

    <main className="dashboard">
      <DashboardHeader />
      <FinancialSummary />
      <ExpenseChart />
      <MovementTable />
      <QuickActions />
    </main>
  );
}

export default Dashboard;