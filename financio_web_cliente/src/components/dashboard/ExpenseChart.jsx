import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

import {
    Doughnut
} from 'react-chartjs-2';

import {
    useFinance
} from '../../context/FinanceContext';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function ExpenseChart({filtroTexto,categoriaSeleccionada}) {

  const {
    movimientos
  } = useFinance();

  // FILTRAR SOLO GASTOS
  const gastos =
  movimientos.filter((mov) => {

    const esGasto =
      mov.tipo === 'gasto';

    const coincideTexto =
      mov.descripcion
        .toLowerCase()
        .includes(
          filtroTexto.toLowerCase()
        );

    const coincideCategoria =

      categoriaSeleccionada === '' ||

      mov.categoria ===
      categoriaSeleccionada;

    return (
      esGasto &&
      coincideTexto &&
      coincideCategoria
    );
  });

  // AGRUPAR POR CATEGORIA
  const gastosPorCategoria = {};

  gastos.forEach((mov) => {

    if (
      gastosPorCategoria[mov.categoria]
    ) {

      gastosPorCategoria[mov.categoria] +=
        mov.monto;

    } else {

      gastosPorCategoria[mov.categoria] =
        mov.monto;
    }
  });

  // LABELS
  const labels =
    Object.keys(gastosPorCategoria);

  // DATOS
  const dataValores =
    Object.values(gastosPorCategoria);

  const data = {

    labels,

    datasets: [
      {
        data: dataValores,

        backgroundColor: [
          '#162577',
          '#1dc4d4',
          '#4f46e5',
          '#06b6d4',
          '#8b5cf6',
          '#0ea5e9',
          '#14b8a6'
        ],

        borderWidth: 2
      }
    ]
  };

  const options = {

    responsive: true,

    plugins: {

      legend: {

        position: 'bottom'
      }
    }
  };

  return (

    <section className="card">

      <h3>
        Gastos por categoría
      </h3>

      {
        gastos.length === 0 ? (

          <p>
            No hay gastos registrados
          </p>

        ) : (

          <div
            style={{
              width: '350px',
              margin: '0 auto'
            }}
          >

            <Doughnut
              data={data}
              options={options}
            />

          </div>
        )
      }

    </section>
  );
}

export default ExpenseChart;