import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';


function Login() {

    const navigate = useNavigate();

    const {
    login
    } = useAuth();

    const [correo,
    setCorreo] = useState('');

    const [password,
    setPassword] = useState('');

    const [error,
    setError] = useState('');

    const handleSubmit = (e) => {

    e.preventDefault();

    setError('');

    // VALIDACION
    if (!correo || !password) {

        setError(
        'Todos los campos son obligatorios'
        );

        return;
    }

    const resultado =
        login(correo, password);

    if (!resultado.ok) {

        setError(resultado.mensaje);

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
            <p className="error">
            {error}
            </p>
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

        <button
            type="submit"
            className="btn-primary"
        >
            Entrar
        </button>

        <p className="auth-link">
            ¿No tienes cuenta?
            <Link to="/register">
            Regístrate
            </Link>
        </p>

        </form>

    </main>
  );
}

export default Login;