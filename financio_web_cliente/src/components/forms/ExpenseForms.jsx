import {
  useEffect,
  useMemo,
  useState
} from 'react';

import { useFinance } from '../../context/FinanceContext';

function ExpenseForm() {
  const {
    categoriasGasto,
    categoriasIngreso,
    agregarMovimiento,
    cargandoFinanzas
  } = useFinance();

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('gasto');
  const [categoriaId, setCategoriaId] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  const categoriasDisponibles = useMemo(() => {
    return tipo === 'gasto'
      ? categoriasGasto
      : categoriasIngreso;
  }, [tipo, categoriasGasto, categoriasIngreso]);

  useEffect(() => {
    if (
      categoriasDisponibles.length > 0 &&
      !categoriaId
    ) {
      setCategoriaId(categoriasDisponibles[0].id);
    }
  }, [categoriasDisponibles, categoriaId]);

  const handleTipoChange = (nuevoTipo) => {
    setTipo(nuevoTipo);

    const nuevasCategorias =
      nuevoTipo === 'gasto'
        ? categoriasGasto
        : categoriasIngreso;

    if (nuevasCategorias.length > 0) {
      setCategoriaId(nuevasCategorias[0].id);
    } else {
      setCategoriaId('');
    }
  };

  const formatearFecha = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 10);
  };

  const handleFechaChange = (e) => {
    setFecha(formatearFecha(e.target.value));
  };

  const limpiarFormulario = () => {
    setDescripcion('');
    setMonto('');
    setTipo('gasto');
    setCategoriaId(
      categoriasGasto.length > 0
        ? categoriasGasto[0].id
        : ''
    );
    setFecha('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMensaje('');

    if (
      !descripcion.trim() ||
      !monto ||
      !fecha ||
      !categoriaId
    ) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (Number(monto) <= 0) {
      setError('El monto debe ser mayor a cero');
      return;
    }

    const fechaRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!fechaRegex.test(fecha)) {
      setError('La fecha debe tener formato dd/mm/aaaa');
      return;
    }

    setGuardando(true);

    const resultado = await agregarMovimiento({
      descripcion: descripcion.trim(),
      monto: Number(monto),
      tipo,
      categoria_id: categoriaId,
      fecha
    });

    setGuardando(false);

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    setMensaje('Movimiento guardado correctamente');
    limpiarFormulario();
  };

  return (
    <section className="movement-form-card">
      <div className="movement-form-card__header">
        <div>
          <span className="movement-form-card__label">
            Registro financiero
          </span>

          <h3>Nuevo movimiento</h3>
        </div>
      </div>

      {error && (
        <div className="form-alert form-alert--error">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="form-alert form-alert--success">
          {mensaje}
        </div>
      )}

      <form
        className="movement-form"
        onSubmit={handleSubmit}
      >
        <div className="form-field">
          <label>Descripción</label>

          <input
            type="text"
            placeholder="Ej. Compra de comida"
            value={descripcion}
            onChange={(e) =>
              setDescripcion(e.target.value)
            }
          />
        </div>

        <div className="form-field">
          <label>Monto</label>

          <input
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={monto}
            onChange={(e) =>
              setMonto(e.target.value)
            }
          />
        </div>

        <div className="form-field">
          <label>Tipo</label>

          <select
            value={tipo}
            onChange={(e) =>
              handleTipoChange(e.target.value)
            }
          >
            <option value="gasto">
              Gasto
            </option>

            <option value="ingreso">
              Ingreso
            </option>
          </select>
        </div>

        <div className="form-field">
          <label>Categoría</label>

          <select
            value={categoriaId}
            onChange={(e) =>
              setCategoriaId(e.target.value)
            }
            disabled={
              cargandoFinanzas ||
              categoriasDisponibles.length === 0
            }
          >
            {categoriasDisponibles.length === 0 ? (
              <option value="">
                No hay categorías disponibles
              </option>
            ) : (
              categoriasDisponibles.map((categoria) => (
                <option
                  key={categoria.id}
                  value={categoria.id}
                >
                  {categoria.nombre}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="form-field">
          <label>Fecha</label>

          <input
            type="text"
            placeholder="dd/mm/aaaa"
            value={fecha}
            maxLength={10}
            onChange={handleFechaChange}
          />
        </div>

        <button
          type="submit"
          className="btn-save-movement"
          disabled={guardando || cargandoFinanzas}
        >
          {guardando
            ? 'Guardando...'
            : 'Guardar movimiento'}
        </button>
      </form>
    </section>
  );
}

export default ExpenseForm;