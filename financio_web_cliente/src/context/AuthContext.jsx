import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

const AuthContext = createContext();

export function AuthProvider({
  children
}) {

  const [usuario, setUsuario] =
    useState(null);

  const [usuarios, setUsuarios] = useState(() => {
    const usuariosStorage =
      localStorage.getItem('usuarios');

    if (usuariosStorage) {
      return JSON.parse(usuariosStorage);
    }

    const usuarioInicial = [
      {
        id: 1,
        nombre: 'Admin',
        correo: 'admin@test.com',
        password: '123456'
      }
    ];

    localStorage.setItem(
      'usuarios',
      JSON.stringify(usuarioInicial)
    );

    return usuarioInicial;
  });

  // CARGAR SESION
  useEffect(() => {
    const sesionStorage =
      localStorage.getItem('sesion');

    if (sesionStorage) {
      setUsuario(
        JSON.parse(sesionStorage)
      );
    }
  }, []);

  // GUARDAR USUARIOS
  useEffect(() => {

    localStorage.setItem(
      'usuarios',
      JSON.stringify(usuarios)
    );

  }, [usuarios]);

  // REGISTRO
  const register = (
    nombre,
    correo,
    password
  ) => {

    const existeUsuario =
      usuarios.find(
        user => user.correo === correo
      );

    if (existeUsuario) {

      return {
        ok: false,
        mensaje:
          'El usuario ya existe'
      };
    }

    const nuevoUsuario = {

      id: Date.now(),

      nombre,

      correo,

      password
    };

    setUsuarios([
      ...usuarios,
      nuevoUsuario
    ]);

    return {
      ok: true
    };
  };

  // LOGIN
  const login = (
    correo,
    password
  ) => {

    const usuarioEncontrado =
      usuarios.find(
        user =>
          user.correo === correo &&
          user.password === password
      );

    if (!usuarioEncontrado) {

      return {
        ok: false,
        mensaje:
          'Credenciales incorrectas'
      };
    }

    setUsuario(usuarioEncontrado);

    localStorage.setItem(
      'sesion',
      JSON.stringify(usuarioEncontrado)
    );

    return {
      ok: true
    };
  };

  const actualizarPerfil = (datosActualizados) => {
    const usuarioActualizado = {
      ...usuario,
      ...datosActualizados
    };

    setUsuario(usuarioActualizado);

    localStorage.setItem(
      'sesion',
      JSON.stringify(usuarioActualizado)
    );

    const usuariosActualizados = usuarios.map((user) =>
      user.id === usuario.id
        ? usuarioActualizado
        : user
    );

    setUsuarios(usuariosActualizados);

    localStorage.setItem(
      'usuarios',
      JSON.stringify(usuariosActualizados)
    );

    return {
      ok: true,
      mensaje: 'Perfil actualizado correctamente'
    };
  };

  const actualizarPassword = (
  passwordActual,
  nuevaPassword
) => {
  if (!usuario) {
    return {
      ok: false,
      mensaje: 'No hay una sesión activa'
    };
  }

  if (usuario.password !== passwordActual) {
    return {
      ok: false,
      mensaje: 'La contraseña actual no es correcta'
    };
  }

  const usuarioActualizado = {
      ...usuario,
      password: nuevaPassword
    };

    setUsuario(usuarioActualizado);

    localStorage.setItem(
      'sesion',
      JSON.stringify(usuarioActualizado)
    );

    const usuariosActualizados = usuarios.map((user) =>
      user.id === usuario.id
        ? usuarioActualizado
        : user
    );

    setUsuarios(usuariosActualizados);

    localStorage.setItem(
      'usuarios',
      JSON.stringify(usuariosActualizados)
    );

    return {
      ok: true,
      mensaje: 'Contraseña actualizada correctamente'
    };
  };

  // LOGOUT
  const logout = () => {

    setUsuario(null);

    localStorage.removeItem('sesion');
  };

  return (

    <AuthContext.Provider
      value={{
        usuario,
        usuarios,
        register,
        login,
        actualizarPerfil,
        actualizarPassword,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

export function useAuth() {

  return useContext(AuthContext);
}