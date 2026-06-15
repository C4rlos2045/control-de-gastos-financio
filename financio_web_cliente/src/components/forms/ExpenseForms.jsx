import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { categorias } from '../../utils/categories';

function ExpenseForm() {
  const { agregarMovimiento } = useFinance();

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('gasto');
  const [categoria, setCategoria] = useState('Comida');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState('');

  const handleTipoChange = (nuevoTipo) => {
    setTipo(nuevoTipo);
    setCategoria(categorias[nuevoTipo][0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!descripcion.trim() || !monto) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (Number(monto) <= 0) {
      setError('El monto debe ser mayor a cero');
      return;
    }

    agregarMovimiento({
      descripcion: descripcion.trim(),
      monto: Number(monto),
      tipo,
      categoria,
      fecha: fecha || new Date().toISOString()
    });

    setDescripcion('');
    setMonto('');
    setTipo('gasto');
    setCategoria('Comida');
    setFecha('');
  };

  return (
    <section className="movement-form-card">
      <div className="movement-form-card__header">
        <div>
          <span className="movement-form-card__label">
            Registro financiero
          </span>

          <h3>
            Nuevo movimiento
          </h3>
        </div>
      </div>

      {error && (
        <div className="form-alert form-alert--error">
          {error}
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
            onChange={(e) => setDescripcion(e.target.value)}
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
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Tipo</label>
          <select
            value={tipo}
            onChange={(e) => handleTipoChange(e.target.value)}
          >
            <option value="gasto">Gasto</option>
            <option value="ingreso">Ingreso</option>
          </select>
        </div>

        <div className="form-field">
          <label>Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categorias[tipo].map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn-save-movement"
        >
          Guardar movimiento
        </button>
      </form>
    </section>
  );
}

export default ExpenseForm;