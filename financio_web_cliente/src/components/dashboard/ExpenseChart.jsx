import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function ExpenseChart() {

    const data = {

    labels: [
        'Comida',
        'Transporte',
        'Servicios',
        'Ocio',
        'Otros'
    ],

    datasets: [
        {
        data: [3000, 1500, 2500, 1000, 2000],

        backgroundColor: [
            '#162577',
            '#1dc4d4',
            '#4f46e5',
            '#06b6d4',
            '#f59e0b'
        ]
        }
    ]
    };

    return (

    <section className="card">

        <h3>Distribución de gastos</h3>

        <div
        style={{
            width: '350px',
            margin: '0 auto'
        }}
        >

        <Doughnut data={data} />

        </div>

    </section>
    );
}

export default ExpenseChart;