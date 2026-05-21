import {
  categorias
} from '../../utils/categories';

function ExpenseFilters({

  filtroTexto,
  setFiltroTexto,

  categoriaSeleccionada,
  setCategoriaSeleccionada
}) {

  return (

    <section className="card">

      <h3>
        Filtrar gastos
      </h3>

      <div className="filters">

        {/* BUSCADOR */}

        <input
          type="text"
          placeholder="Buscar movimiento..."
          value={filtroTexto}
          onChange={(e) =>
            setFiltroTexto(e.target.value)
          }
        />

        {/* CATEGORIA */}

        <select
          value={categoriaSeleccionada}
          onChange={(e) =>
            setCategoriaSeleccionada(
              e.target.value
            )
          }
        >

          <option value="">
            Todas las categorías
          </option>

          {
            categorias.gasto.map((cat) => (

              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            ))
          }

        </select>

      </div>

    </section>
  );
}

export default ExpenseFilters;