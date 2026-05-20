import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

function Login() {

    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const { login } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = (e) => {

    e.preventDefault();

    setError('');

    // VALIDACION
    if (!correo || !password) {
        setError('Todos los campos son obligatorios');
        return;
    }

    const autenticado = login(correo, password);

    if (!autenticado) {
        setError('Credenciales incorrectas');
        return;
    }

    navigate('/dashboard');
    };

    return (

    <main className="login">

        <form
        className="login__form"
        onSubmit={handleSubmit}
        >

        <h1>Iniciar sesión</h1>

        {
            error &&
            <p className="error">{error}</p>
        }

        <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) =>
            setCorreo(e.target.value)
            }
        />

        <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
            setPassword(e.target.value)
            }
        />

        <button type="submit">
            Entrar
        </button>

        </form>

    </main>
    );
}

export default Login;