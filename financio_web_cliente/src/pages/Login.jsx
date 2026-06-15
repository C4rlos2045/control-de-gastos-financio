import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!correo || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const resultado = login(correo, password);

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    navigate('/dashboard');
  };

  return (
    <AuthLayout
      title="Iniciar sesión"
    >
      {error && (
        <div className="auth-alert auth-alert--error">
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="usuario@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="auth-button">
          Entrar
        </button>
      </form>

      <p className="auth-link">
        ¿No tienes cuenta?
        <Link to="/register"> Regístrate</Link>
      </p>
    </AuthLayout>
  );
}

export default Login;