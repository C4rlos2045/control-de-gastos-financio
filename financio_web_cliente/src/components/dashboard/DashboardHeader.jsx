import { useAuth } from '../../context/AuthContext';

function DashboardHeader() {
  const { usuario, logout } = useAuth();

  return (
    <section className="dashboard-header">
      <div className="dashboard-header__info">

        <h2>
          Bienvenido {usuario?.nombre || 'Usuario'}
        </h2>

        <p>
          Administra tus ingresos, gastos y movimientos desde un solo lugar.
        </p>
      </div>

      <button
        className="dashboard-header__logout"
        onClick={logout}
      >
        Cerrar sesión
      </button>
    </section>
  );
}

export default DashboardHeader;