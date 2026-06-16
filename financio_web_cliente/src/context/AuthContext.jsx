/* eslint-disable no-unused-vars, react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import { authApi } from '../services/authApi';
import { perfilApi } from '../services/perfilApi';

import {
  guardarToken,
  obtenerToken,
  eliminarToken
} from '../utils/authStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const validarSesion = async () => {
      const token = obtenerToken();

      if (!token) {
        setCargandoSesion(false);
        return;
      }

      try {
        const data = await authApi.me();
        setUsuario(data.usuario);
      } catch (error) {
        eliminarToken();
        setUsuario(null);
      } finally {
        setCargandoSesion(false);
      }
    };

    validarSesion();
  }, []);

  const register = async (nombre, correo, password) => {
    try {
      const data = await authApi.register({
        nombre,
        correo,
        password
      });

      guardarToken(data.token);
      setUsuario(data.usuario);

      return {
        ok: true,
        mensaje: data.mensaje,
        usuario: data.usuario
      };
    } catch (error) {
      return {
        ok: false,
        mensaje: error.message
      };
    }
  };

  const login = async (correo, password) => {
    try {
      const data = await authApi.login({
        correo,
        password
      });

      guardarToken(data.token);
      setUsuario(data.usuario);

      return {
        ok: true,
        mensaje: data.mensaje,
        usuario: data.usuario
      };
    } catch (error) {
      return {
        ok: false,
        mensaje: error.message
      };
    }
  };

  const logout = () => {
    eliminarToken();
    setUsuario(null);
  };

  const obtenerPerfil = async () => {
    try {
      const data = await perfilApi.obtenerPerfil();

      setUsuario(data.usuario);

      return {
        ok: true,
        usuario: data.usuario
      };
    } catch (error) {
      return {
        ok: false,
        mensaje: error.message
      };
    }
  };

  const actualizarPerfil = async (datos) => {
    try {
      const data = await perfilApi.actualizarPerfil(datos);

      setUsuario(data.usuario);

      return {
        ok: true,
        mensaje: data.mensaje,
        usuario: data.usuario
      };
    } catch (error) {
      return {
        ok: false,
        mensaje: error.message
      };
    }
  };

  const actualizarPassword = async (
    passwordActual,
    nuevaPassword,
    confirmarPassword
  ) => {
    try {
      const data = await perfilApi.actualizarPassword({
        passwordActual,
        nuevaPassword,
        confirmarPassword
      });

      return {
        ok: true,
        mensaje: data.mensaje
      };
    } catch (error) {
      return {
        ok: false,
        mensaje: error.message
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargandoSesion,
        register,
        login,
        logout,
        obtenerPerfil,
        actualizarPerfil,
        actualizarPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}