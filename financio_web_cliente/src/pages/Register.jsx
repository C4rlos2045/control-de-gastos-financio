import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!nombre || !correo || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const resultado = register(nombre, correo, password);

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    setSuccess('Usuario registrado correctamente');

    setTimeout(() => {
      navigate('/login');
    }, 1200);
  };

  return (
    <AuthLayout
      title="Crear cuenta"
    >
      {error && (
        <div className="auth-alert auth-alert--error">
          {error}
        </div>
      )}

      {success && (
        <div className="auth-alert auth-alert--success">
          {success}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Juan Pérez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

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

        <div className="auth-field">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="auth-button">
          Registrarse
        </button>
      </form>

      <p className="auth-link">
        ¿Ya tienes cuenta?
        <Link to="/login"> Inicia sesión</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;