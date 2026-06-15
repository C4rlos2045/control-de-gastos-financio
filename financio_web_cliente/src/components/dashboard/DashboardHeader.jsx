import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
function DashboardHeader() {
  const { usuario, logout } = useAuth();

  return (
    <section className="dashboard-header">
      <div className="dashboard-header__info">

        <h2>
          Bienvenido <Link to="/profile"> {usuario?.nombre || 'Usuario'}</Link>
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