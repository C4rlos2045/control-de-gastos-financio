import { useFinance } from '../../context/FinanceContext';

function MovementTable() {
  const {
    movimientos,
    eliminarMovimiento
  } = useFinance();

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
                      className="btn-delete"
                      onClick={() =>
                        eliminarMovimiento(mov.id)
                      }
                    >
                      Eliminar
                    </button>
                  </td>
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