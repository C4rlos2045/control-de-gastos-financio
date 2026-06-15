import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AvatarUploader from '../components/profile/AvatarUploader';
import '../styles/profile.css';

function Profile() {
  const {
    usuario,
    actualizarPerfil,
    actualizarPassword
  } = useAuth();

  const [nombre, setNombre] = useState(
    usuario?.nombre || ''
  );

  const [correo, setCorreo] = useState(
    usuario?.correo || ''
  );

  const [telefono, setTelefono] = useState(
    usuario?.telefono || ''
  );

  const [curp, setCurp] = useState(
    usuario?.curp || ''
  );

  const [rfc, setRfc] = useState(
    usuario?.rfc || ''
  );

const [passwordActual, setPasswordActual] = useState('');
const [nuevaPassword, setNuevaPassword] = useState('');
const [confirmarPassword, setConfirmarPassword] = useState('');

  const [direccion, setDireccion] = useState(
    usuario?.direccion || ''
  );

  const [avatar, setAvatar] = useState(
    usuario?.avatar || ''
  );

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setMensaje('');
    setError('');

    if (!nombre.trim() || !correo.trim()) {
      setError(
        'El nombre y el correo son obligatorios'
      );
      return;
    }

    const resultado = actualizarPerfil({
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      curp: curp.trim().toUpperCase(),
      rfc: rfc.trim().toUpperCase(),
      avatar
    });

    if (resultado.ok) {
      setMensaje(resultado.mensaje);
    }
  };


  const handlePasswordSubmit = (e) => {
  e.preventDefault();

  setMensaje('');
  setError('');

  if (
    !passwordActual ||
    !nuevaPassword ||
    !confirmarPassword
  ) {
    setError(
      'Todos los campos de contraseña son obligatorios'
    );
    return;
  }

  if (nuevaPassword.length < 6) {
    setError(
      'La nueva contraseña debe tener mínimo 6 caracteres'
    );
    return;
  }

  if (nuevaPassword !== confirmarPassword) {
    setError(
      'La nueva contraseña y su confirmación no coinciden'
    );
    return;
  }

  const resultado = actualizarPassword(
    passwordActual,
    nuevaPassword
  );

  if (!resultado.ok) {
    setError(resultado.mensaje);
    return;
  }

  setMensaje(resultado.mensaje);

  setPasswordActual('');
  setNuevaPassword('');
  setConfirmarPassword('');
};

  const cancelarCambios = () => {
    setNombre(usuario?.nombre || '');
    setCorreo(usuario?.correo || '');
    setTelefono(usuario?.telefono || '');
    setDireccion(usuario?.direccion || '');
    setCurp(usuario?.curp || '');
    setRfc(usuario?.rfc || '');
    setAvatar(usuario?.avatar || '');

    setPasswordActual('');
    setNuevaPassword('');
    setConfirmarPassword('');

    setMensaje('Cambios descartados');
    setError('');
  };

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-card__header">
          <span className="profile-card__label">
            Cuenta de usuario
          </span>

          <h2>
            Mi perfil
          </h2>

          <p>
            Consulta y actualiza tu información personal.
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
          <AvatarUploader
            avatar={avatar}
            setAvatar={setAvatar}
          />

          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >
            <div className="profile-field">
              <label>Nombre de usuario *</label>

              <input
                type="text"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
              />
            </div>

            <div className="profile-field">
              <label>Correo electrónico *</label>

              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={correo}
                onChange={(e) =>
                  setCorreo(e.target.value)
                }
              />
            </div>
            
            <div className="profile-field">
          <label>CURP</label>

          <input
            type="text"
            placeholder="Ej. AAPJ990101HMCXXX00"
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
            placeholder="Ej. AAPJ990101XXX"
            value={rfc}
            maxLength={13}
            onChange={(e) =>
              setRfc(e.target.value.toUpperCase())
            }
          />
</div>


            <div className="profile-field">
              <label>Teléfono</label>

              <input
                type="tel"
                placeholder="+52 123 456 7890"
                value={telefono}
                onChange={(e) =>
                  setTelefono(e.target.value)
                }
              />
            </div>

            <br></br>
            <form
              className="password-form"
              onSubmit={handlePasswordSubmit}
            >
              <div className="password-form__header">
                <span className="profile-card__label">
                  Seguridad
                </span>

                <h3>
                  Actualizar contraseña
                </h3>

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
                <label>Confirmar nueva contraseña</label>

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

            <div className="profile-field profile-field--full">
              <label>Dirección</label>

              <textarea
                rows="3"
                placeholder="Calle, número, colonia, ciudad"
                value={direccion}
                onChange={(e) =>
                  setDireccion(e.target.value)
                }
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
        </div>
      </section>
    </main>
  );
}

export default Profile;