import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

const FinanceContext = createContext();

export function FinanceProvider({
    children
}) {

    const [movimientos, setMovimientos] =
    useState([]);

  // CARGAR LOCALSTORAGE
    useEffect(() => {

    const data =
        localStorage.getItem('movimientos');

    if (data) {
        setMovimientos(JSON.parse(data));
    }

    }, []);

  // GUARDAR LOCALSTORAGE
    useEffect(() => {

    localStorage.setItem(
        'movimientos',
        JSON.stringify(movimientos)
    );

    }, [movimientos]);

  // AGREGAR MOVIMIENTO
    const agregarMovimiento = (
        nuevoMovimiento
    ) => {

    setMovimientos([
        ...movimientos,
        {
        id: Date.now(),
        ...nuevoMovimiento
        }
    ]);
    };

  // ELIMINAR
    const eliminarMovimiento = (id) => {

    setMovimientos(
        movimientos.filter(
        mov => mov.id !== id
        )
    );
    };

    return (

    <FinanceContext.Provider
        value={{
        movimientos,
        agregarMovimiento,
        eliminarMovimiento
        }}
    >

        {children}

    </FinanceContext.Provider>
    );
}

export function useFinance() {
    return useContext(FinanceContext);
}