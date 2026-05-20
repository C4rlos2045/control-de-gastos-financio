import {
    useState
} from 'react';

import {
    useFinance
} from '../../context/FinanceContext';

function ExpenseForm() {

    const {
    agregarMovimiento
    } = useFinance();

    const [descripcion,
    setDescripcion] = useState('');

    const [monto,
    setMonto] = useState('');

    const [tipo,
    setTipo] = useState('gasto');

    const [error,
    setError] = useState('');

    const handleSubmit = (e) => {

    e.preventDefault();

    setError('');

    // VALIDACIONES
    if (
        !descripcion ||
        !monto
    ) {

        setError(
        'Todos los campos son obligatorios'
        );

        return;
    }

    if (monto <= 0) {

        setError(
        'El monto debe ser mayor a cero'
        );

        return;
    }

    agregarMovimiento({
        descripcion,
        monto: Number(monto),
        tipo
    });

    // LIMPIAR
    setDescripcion('');
    setMonto('');
    };

    return (

    <section className="card">

        <h3>
        Nuevo movimiento
        </h3>

        {
        error &&
        <p className="error">
            {error}
        </p>
        }

        <form onSubmit={handleSubmit}>

        <input
            type="text"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) =>
            setDescripcion(e.target.value)
            }
        />

        <input
            type="number"
            placeholder="Monto"
            value={monto}
            onChange={(e) =>
            setMonto(e.target.value)
            }
        />

        <select
            value={tipo}
            onChange={(e) =>
            setTipo(e.target.value)
            }
        >

            <option value="gasto">
            Gasto
            </option>

            <option value="ingreso">
            Ingreso
            </option>

        </select>

        <button type="submit">
            Guardar
        </button>

        </form>

    </section>
    );
}

export default ExpenseForm;