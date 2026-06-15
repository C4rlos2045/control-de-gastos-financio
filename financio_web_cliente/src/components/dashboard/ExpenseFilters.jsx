import { categorias } from '../../utils/categories';

function ExpenseFilters({
  filtroTexto,
  setFiltroTexto,
  categoriaSeleccionada,
  setCategoriaSeleccionada
}) {
  return (
    <section className="filters-card">
      <div className="filters-card__header">
        <div>
          <h3>
            Filtrar movimientos
          </h3>
        </div>
      </div>

      <div className="filters-grid">
        <div className="filter-field filter-field--search">
          <label>Buscar movimiento</label>

          <input
            type="text"
            placeholder="Ej. comida, transporte..."
            value={filtroTexto}
            onChange={(e) =>
              setFiltroTexto(e.target.value)
            }
          />
        </div>

        <div className="filter-field">
          <label>Categoría</label>

          <select
            value={categoriaSeleccionada}
            onChange={(e) =>
              setCategoriaSeleccionada(e.target.value)
            }
          >
            <option value="">
              Todas las categorías
            </option>

            {categorias.gasto.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

export default ExpenseFilters;