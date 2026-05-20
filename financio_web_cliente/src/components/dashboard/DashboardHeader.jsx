import { useAuth } from '../../context/AuthContext';

function DashboardHeader() {

    const { usuario, logout } = useAuth();

    return (

    <header className="card">

        <h2>
        Bienvenido {usuario?.nombre}
        </h2>

        <button onClick={logout}>
        Cerrar sesión
        </button>

    </header>
    );
}

export default DashboardHeader;