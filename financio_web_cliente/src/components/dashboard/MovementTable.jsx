import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';

function MovementTable() {
  const {
    movimientos,
    categoriasGasto,
    categoriasIngreso,
    actualizarMovimiento,
    eliminarMovimiento
  } = useFinance();

  const [editandoId, setEditandoId] = useState(null);
  const [formEdit, setFormEdit] = useState({});
  const [error, setError] = useState('');

  const obtenerCategoriasPorTipo = (tipo) => {
    return tipo === 'ingreso'
      ? categoriasIngreso
      : categoriasGasto;
  };

  const iniciarEdicion = (mov) => {
    setError('');

    setEditandoId(mov.id);

    setFormEdit({
      descripcion: mov.descripcion,
      tipo: mov.tipo,
      categoria_id: mov.categoria_id,
      fecha: mov.fecha,
      monto: mov.monto
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormEdit({});
    setError('');
  };

  const handleTipoChange = (nuevoTipo) => {
    const categoriasDisponibles =
      obtenerCategoriasPorTipo(nuevoTipo);

    setFormEdit({
      ...formEdit,
      tipo: nuevoTipo,
      categoria_id:
        categoriasDisponibles.length > 0
          ? categoriasDisponibles[0].id
          : ''
    });
  };

  const guardarEdicion = async () => {
    setError('');

    if (
      !formEdit.descripcion ||
      !formEdit.monto ||
      !formEdit.fecha ||
      !formEdit.categoria_id
    ) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (Number(formEdit.monto) <= 0) {
      setError('El monto debe ser mayor a cero');
      return;
    }

    const resultado = await actualizarMovimiento(
      editandoId,
      {
        descripcion: formEdit.descripcion.trim(),
        tipo: formEdit.tipo,
        categoria_id: formEdit.categoria_id,
        fecha: formEdit.fecha,
        monto: Number(formEdit.monto)
      }
    );

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    setEditandoId(null);
    setFormEdit({});
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar este movimiento?'
    );

    if (!confirmar) return;

    const resultado = await eliminarMovimiento(id);

    if (!resultado.ok) {
      setError(resultado.mensaje);
    }
  };

  return (
    <section className="movements-card">
      <div className="movements-card__header">
        <div>
          <span className="movements-card__label">
            Historial
          </span>

          <h3>
            Movimientos recientes
          </h3>
        </div>
      </div>

      {error && (
        <div className="form-alert form-alert--error">
          {error}
        </div>
      )}

      <div className="movements-table-wrapper">
        <table className="movements-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {movimientos.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="movements-table__empty"
                >
                  No hay movimientos registrados.
                </td>
              </tr>
            ) : (
              movimientos.map((mov) => {
                const estaEditando =
                  editandoId === mov.id;

                const categoriasDisponibles =
                  obtenerCategoriasPorTipo(
                    formEdit.tipo || mov.tipo
                  );

                return (
                  <tr key={mov.id}>
                    {estaEditando ? (
                      <>
                        <td>
                          <input
                            className="table-input"
                            type="text"
                            value={formEdit.descripcion}
                            onChange={(e) =>
                              setFormEdit({
                                ...formEdit,
                                descripcion: e.target.value
                              })
                            }
                          />
                        </td>

                        <td>
                          <select
                            className="table-input"
                            value={formEdit.tipo}
                            onChange={(e) =>
                              handleTipoChange(
                                e.target.value
                              )
                            }
                          >
                            <option value="gasto">
                              Gasto
                            </option>

                            <option value="ingreso">
                              Ingreso
                            </option>
                          </select>
                        </td>

                        <td>
                          <select
                            className="table-input"
                            value={
                              formEdit.categoria_id || ''
                            }
                            onChange={(e) =>
                              setFormEdit({
                                ...formEdit,
                                categoria_id:
                                  e.target.value
                              })
                            }
                            disabled={
                              categoriasDisponibles.length ===
                              0
                            }
                          >
                            {categoriasDisponibles.length ===
                            0 ? (
                              <option value="">
                                Sin categorías
                              </option>
                            ) : (
                              categoriasDisponibles.map(
                                (categoria) => (
                                  <option
                                    key={categoria.id}
                                    value={categoria.id}
                                  >
                                    {categoria.nombre}
                                  </option>
                                )
                              )
                            )}
                          </select>
                        </td>

                        <td>
                          <input
                            className="table-input"
                            type="text"
                            value={formEdit.fecha}
                            onChange={(e) =>
                              setFormEdit({
                                ...formEdit,
                                fecha: e.target.value
                              })
                            }
                          />
                        </td>

                        <td>
                          <input
                            className="table-input"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formEdit.monto}
                            onChange={(e) =>
                              setFormEdit({
                                ...formEdit,
                                monto: e.target.value
                              })
                            }
                          />
                        </td>

                        <td>
                          <button
                            className="btn-edit"
                            onClick={guardarEdicion}
                          >
                            Guardar
                          </button>

                          <button
                            className="btn-delete"
                            onClick={cancelarEdicion}
                          >
                            Cancelar
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          {mov.descripcion}
                        </td>

                        <td>
                          <span
                            className={
                              mov.tipo === 'ingreso'
                                ? 'badge badge--income'
                                : 'badge badge--expense'
                            }
                          >
                            {mov.tipo === 'ingreso'
                              ? 'Ingreso'
                              : 'Gasto'}
                          </span>
                        </td>

                        <td>
                          {mov.categoria}
                        </td>

                        <td>
                          {mov.fecha}
                        </td>

                        <td className="movements-table__amount">
                          ${Number(mov.monto).toFixed(2)}
                        </td>

                        <td>
                          <button
                            className="btn-edit"
                            onClick={() =>
                              iniciarEdicion(mov)
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="btn-delete"
                            onClick={() =>
                              handleEliminar(mov.id)
                            }
                          >
                            Eliminar
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default MovementTable;