import { NavLink } from "react-router-dom";

function Navbar() {
return (
    <header className="navbar">

    <div className="navbar__logo">
        FinanCIO
    </div>

    <nav className="navbar__nav">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/login">Iniciar sesión</NavLink>
        <NavLink to="/register">Registrarse</NavLink>
    </nav>
    </header>
);
}

export default Navbar;