import { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';

function ExpenseFilters({
  filtroTexto,
  setFiltroTexto,
  categoriaSeleccionada,
  setCategoriaSeleccionada,
  tipoSeleccionado,
  setTipoSeleccionado
}) {
  const {
    categorias,
    categoriasGasto,
    categoriasIngreso,
    cargandoFinanzas
  } = useFinance();

  const categoriasDisponibles = useMemo(() => {
    if (tipoSeleccionado === 'gasto') {
      return categoriasGasto;
    }

    if (tipoSeleccionado === 'ingreso') {
      return categoriasIngreso;
    }

    return categorias;
  }, [
    tipoSeleccionado,
    categorias,
    categoriasGasto,
    categoriasIngreso
  ]);

  const handleTipoChange = (nuevoTipo) => {
    setTipoSeleccionado(nuevoTipo);
    setCategoriaSeleccionada('');
  };

  return (
    <section className="filters-card">
      <div className="filters-card__header">
        <div>
          <span className="filters-card__label">
            Búsqueda y filtros
          </span>

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
            disabled={
              cargandoFinanzas ||
              categoriasDisponibles.length === 0
            }
          >
            <option value="">
              Todas las categorías
            </option>

            {categoriasDisponibles.map((categoria) => (
              <option
                key={categoria.id}
                value={categoria.id}
              >
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label>Tipo</label>

          <select
            value={tipoSeleccionado}
            onChange={(e) =>
              handleTipoChange(e.target.value)
            }
          >
            <option value="">
              Todos
            </option>

            <option value="gasto">
              Gastos
            </option>

            <option value="ingreso">
              Ingresos
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default ExpenseFilters;