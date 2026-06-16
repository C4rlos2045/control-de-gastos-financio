import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/profile.css';

function Profile() {
  const {
    usuario,
    obtenerPerfil,
    actualizarPerfil,
    actualizarAvatar,
    actualizarPassword
  } = useAuth();

  const [cargando, setCargando] = useState(true);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [curp, setCurp] = useState('');
  const [rfc, setRfc] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const [archivoAvatar, setArchivoAvatar] = useState(null);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargarDatosEnFormulario = (datosUsuario) => {
    const perfil = datosUsuario?.perfil || {};

    setNombre(datosUsuario?.nombre || '');
    setCorreo(datosUsuario?.correo || '');
    setTelefono(perfil.telefono || '');
    setDireccion(perfil.direccion || '');
    setCurp(perfil.curp || '');
    setRfc(perfil.rfc || '');
    setAvatarUrl(perfil.avatar_url || '');
  };

  useEffect(() => {
    const cargarPerfil = async () => {
      setCargando(true);
      setError('');

      const resultado = await obtenerPerfil();

      if (!resultado.ok) {
        setError(resultado.mensaje);
        setCargando(false);
        return;
      }

      cargarDatosEnFormulario(resultado.usuario);
      setCargando(false);
    };

    cargarPerfil();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje('');
    setError('');

    if (!nombre.trim() || !correo.trim()) {
      setError('El nombre y el correo son obligatorios');
      return;
    }

    const resultado = await actualizarPerfil({
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      curp: curp.trim().toUpperCase(),
      rfc: rfc.trim().toUpperCase(),
      avatar_url: avatarUrl.trim()
    });

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    cargarDatosEnFormulario(resultado.usuario);
    setMensaje('Perfil actualizado correctamente');
  };

  const handleAvatarChange = (e) => {
    const archivo = e.target.files[0];

    if (!archivo) return;

    const tiposPermitidos = [
      'image/jpeg',
      'image/png'
    ];

    if (!tiposPermitidos.includes(archivo.type)) {
      setError('Solo se permiten imágenes JPG, JPEG o PNG');
      return;
    }

    const limiteMb = 2;

    if (archivo.size > limiteMb * 1024 * 1024) {
      setError(`La imagen no debe superar ${limiteMb} MB`);
      return;
    }

    setArchivoAvatar(archivo);
    setAvatarUrl(URL.createObjectURL(archivo));
    setMensaje('');
    setError('');
  };

  const handleAvatarSubmit = async () => {
    setMensaje('');
    setError('');

    if (!archivoAvatar) {
      setError('Selecciona una imagen antes de guardar');
      return;
    }

    setSubiendoAvatar(true);

    const resultado = await actualizarAvatar(
      archivoAvatar
    );

    setSubiendoAvatar(false);

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    cargarDatosEnFormulario(resultado.usuario);
    setArchivoAvatar(null);
    setMensaje('Avatar actualizado correctamente');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setMensaje('');
    setError('');

    if (
      !passwordActual ||
      !nuevaPassword ||
      !confirmarPassword
    ) {
      setError('Todos los campos de contraseña son obligatorios');
      return;
    }

    if (nuevaPassword.length < 6) {
      setError('La nueva contraseña debe tener mínimo 6 caracteres');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError('La nueva contraseña y su confirmación no coinciden');
      return;
    }

    const resultado = await actualizarPassword(
      passwordActual,
      nuevaPassword,
      confirmarPassword
    );

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    setPasswordActual('');
    setNuevaPassword('');
    setConfirmarPassword('');

    setMensaje('Contraseña actualizada correctamente');
  };

  const cancelarCambios = () => {
    cargarDatosEnFormulario(usuario);

    setPasswordActual('');
    setNuevaPassword('');
    setConfirmarPassword('');

    setMensaje('Cambios descartados');
    setError('');
  };

  if (cargando) {
    return (
      <main className="profile-page">
        <section className="profile-card">
          <p>Cargando perfil...</p>
        </section>
      </main>
    );
  }

   return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-card__header">
          <span className="profile-card__label">
            Cuenta de usuario
          </span>

          <h2>Mi perfil</h2>

          <p>
            Consulta y actualiza tu información personal desde tu cuenta.
          </p>
        </div>

        {error && (
          <div className="profile-alert profile-alert--error">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="profile-alert profile-alert--success">
            {mensaje}
          </div>
        )}

        <div className="profile-grid">
          <aside className="profile-avatar-section">
          <label
            htmlFor="avatarInput"
            className="profile-avatar"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar del usuario"
              />
            ) : (
              <span className="profile-avatar__placeholder">
                👤
              </span>
            )}

            <span className="profile-avatar__overlay">
              Cambiar foto
            </span>
          </label>

          <input
            id="avatarInput"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleAvatarChange}
            hidden
          />

          <p className="profile-avatar__note">
            Formatos permitidos: JPG, JPEG o PNG. Máximo 2 MB.
          </p>

          <button
            type="button"
            className="profile-button profile-button--primary"
            onClick={handleAvatarSubmit}
            disabled={subiendoAvatar || !archivoAvatar}
          >
            {subiendoAvatar
              ? 'Subiendo...'
              : 'Guardar avatar'}
          </button>
        </aside>

          <div className="profile-content">
            <form
              className="profile-form"
              onSubmit={handleSubmit}
            >
              <div className="profile-field">
                <label>Nombre *</label>

                <input
                  type="text"
                  placeholder="Juan Carlos"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="profile-field">
                <label>Correo electrónico *</label>

                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              <div className="profile-field">
                <label>Teléfono</label>

                <input
                  type="tel"
                  placeholder="7221234567"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>

              <div className="profile-field">
                <label>CURP</label>

                <input
                  type="text"
                  placeholder="AAPJ990101HMCXXX00"
                  value={curp}
                  maxLength={18}
                  onChange={(e) =>
                    setCurp(e.target.value.toUpperCase())
                  }
                />
              </div>

              <div className="profile-field">
                <label>RFC</label>

                <input
                  type="text"
                  placeholder="AAPJ990101XX0"
                  value={rfc}
                  maxLength={13}
                  onChange={(e) =>
                    setRfc(e.target.value.toUpperCase())
                  }
                />
              </div>

              <div className="profile-field profile-field--full">
                <label>Dirección</label>

                <textarea
                  rows="3"
                  placeholder="Calle, colonia, ciudad"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>

              <div className="profile-actions">
                <button
                  type="button"
                  className="profile-button profile-button--secondary"
                  onClick={cancelarCambios}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="profile-button profile-button--primary"
                >
                  Guardar cambios
                </button>
              </div>
            </form>

            <form
              className="password-form"
              onSubmit={handlePasswordSubmit}
            >
              <div className="password-form__header">
                <span className="profile-card__label">
                  Seguridad
                </span>

                <h3>Actualizar contraseña</h3>

                <p>
                  Cambia tu contraseña para mantener segura tu cuenta.
                </p>
              </div>

              <div className="profile-field">
                <label>Contraseña actual</label>

                <input
                  type="password"
                  placeholder="********"
                  value={passwordActual}
                  onChange={(e) =>
                    setPasswordActual(e.target.value)
                  }
                />
              </div>

              <div className="profile-field">
                <label>Nueva contraseña</label>

                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={nuevaPassword}
                  onChange={(e) =>
                    setNuevaPassword(e.target.value)
                  }
                />
              </div>

              <div className="profile-field">
                <label>Confirmar contraseña</label>

                <input
                  type="password"
                  placeholder="Repite la nueva contraseña"
                  value={confirmarPassword}
                  onChange={(e) =>
                    setConfirmarPassword(e.target.value)
                  }
                />
              </div>

              <button
                type="submit"
                className="profile-button profile-button--primary"
              >
                Actualizar contraseña
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;