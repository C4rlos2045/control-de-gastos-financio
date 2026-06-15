import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { categorias } from '../../utils/categories';

function MovementTable() {
  const {
    movimientos,
    eliminarMovimiento,
    actualizarMovimiento
  } = useFinance();

  const [editandoId, setEditandoId] = useState(null);
  const [formEdit, setFormEdit] = useState({});

  const iniciarEdicion = (mov) => {
  setEditandoId(mov.id);
  setFormEdit({ ...mov });
  };

  const guardarEdicion = () => {
  if (!formEdit.descripcion || !formEdit.monto || !formEdit.fecha) {
    return;
  }

  actualizarMovimiento(editandoId, {
    ...formEdit,
    monto: Number(formEdit.monto)
  });

  setEditandoId(null);
  setFormEdit({});
  };

  const cancelarEdicion = () => {
  setEditandoId(null);
  setFormEdit({});
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
              movimientos.map((mov) => (
                <tr key={mov.id}>
                {editandoId === mov.id ? (
                  <>
                    <td>
                      <input
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
                        value={formEdit.tipo}
                        onChange={(e) =>
                          setFormEdit({
                            ...formEdit,
                            tipo: e.target.value,
                            categoria: categorias[e.target.value][0]
                          })
                        }
                      >
                        <option value="gasto">Gasto</option>
                        <option value="ingreso">Ingreso</option>
                      </select>
                    </td>

                    <td>
                      <select
                        value={formEdit.categoria}
                        onChange={(e) =>
                          setFormEdit({
                            ...formEdit,
                            categoria: e.target.value
                          })
                        }
                      >
                        {categorias[formEdit.tipo].map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <input
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
                        type="number"
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
                      <button onClick={guardarEdicion}>
                        Guardar
                      </button>

                      <button onClick={cancelarEdicion}>
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{mov.descripcion}</td>
                    <td>{mov.tipo}</td>
                    <td>{mov.categoria}</td>
                    <td>{mov.fecha}</td>
                    <td>${Number(mov.monto).toFixed(2)}</td>

                    <td>
                      <button onClick={() => iniciarEdicion(mov)}>
                        Editar
                      </button>

                      <button onClick={() => eliminarMovimiento(mov.id)}>
                        Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default MovementTable;