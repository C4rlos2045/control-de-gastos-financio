import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

function Register() {

  const navigate = useNavigate();

  const {
    register
  } = useAuth();

  const [nombre,
    setNombre] = useState('');

  const [correo,
    setCorreo] = useState('');

  const [password,
    setPassword] = useState('');

  const [confirmPassword,
    setConfirmPassword] = useState('');

  const [error,
    setError] = useState('');

  const [success,
    setSuccess] = useState('');

  const handleSubmit = (e) => {

    e.preventDefault();

    setError('');
    setSuccess('');

    // VALIDACIONES
    if (
      !nombre ||
      !correo ||
      !password ||
      !confirmPassword
    ) {

      setError(
        'Todos los campos son obligatorios'
      );

      return;
    }

    if (password.length < 6) {

      setError(
        'La contraseña debe tener mínimo 6 caracteres'
      );

      return;
    }

    if (password !== confirmPassword) {

      setError(
        'Las contraseñas no coinciden'
      );

      return;
    }

    const resultado = register(
      nombre,
      correo,
      password
    );

    if (!resultado.ok) {

      setError(resultado.mensaje);

      return;
    }

    setSuccess(
      'Usuario registrado correctamente'
    );

    setTimeout(() => {

      navigate('/login');

    }, 1500);
  };

  return (

    <main className="login">

      <form
        className="login__form"
        onSubmit={handleSubmit}
      >

        <h1>Crear cuenta</h1>

        {
          error &&
          <p className="error">
            {error}
          </p>
        }

        {
          success &&
          <p className="success">
            {success}
          </p>
        }

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />

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

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="btn-primary"
        >
          Registrarse
        </button>

        <p className="auth-link">
        ¿Ya tienes cuenta?
        <Link to="/login">
        Inicia sesión
        </Link>

</p>
      </form>

    </main>
  );
}

export default Register;