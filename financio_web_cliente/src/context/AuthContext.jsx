import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null);

  // LOGIN SIMULADO
    const login = (correo, password) => {

    if (correo === 'admin@test.com' &&
        password === '123456') {

        const usuarioData = {
        nombre: 'Juan',
        correo
        };

        setUsuario(usuarioData);

        localStorage.setItem(
        'usuario',
        JSON.stringify(usuarioData)
        );

        return true;
    }

    return false;
    };

  // LOGOUT
    const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    };

    return (
    <AuthContext.Provider
        value={{
        usuario,
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