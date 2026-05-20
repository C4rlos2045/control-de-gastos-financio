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

function ExpenseChart() {

    const {
    movimientos
    } = useFinance();

    const ingresos =
    movimientos
        .filter(
        mov => mov.tipo === 'ingreso'
        )
        .reduce(
        (acc, mov) =>
            acc + mov.monto,
        0
        );

    const gastos =
    movimientos
        .filter(
        mov => mov.tipo === 'gasto'
        )
        .reduce(
        (acc, mov) =>
            acc + mov.monto,
        0
        );

    const data = {

    labels: [
        'Ingresos',
        'Gastos'
    ],

    datasets: [
        {
        data: [
            ingresos,
            gastos
        ],

        backgroundColor: [
            '#1dc4d4',
            '#162577'
        ]
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
        Balance financiero
        </h3>

        <div
        style={{
            width: '350px',
            margin: '0 auto'
        }}
        >

        <Doughnut data={data} options={options} />

        </div>

    </section>
    );
}

export default ExpenseChart;