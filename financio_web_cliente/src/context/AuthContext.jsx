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

  const [usuarios, setUsuarios] =
    useState([]);

  // CARGAR DATOS
  useEffect(() => {

    const usuariosStorage =
      localStorage.getItem('usuarios');

    // SI EXISTEN USUARIOS
    if (usuariosStorage) {

      setUsuarios(
        JSON.parse(usuariosStorage)
      );

    } else {

      // USUARIO INICIAL
      const usuarioInicial = [
        {
          id: 1,
          nombre: 'Admin',
          correo: 'admin@test.com',
          password: '123456'
        }
      ];

      setUsuarios(usuarioInicial);

      localStorage.setItem(
        'usuarios',
        JSON.stringify(usuarioInicial)
      );
    }

    // CARGAR SESION
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