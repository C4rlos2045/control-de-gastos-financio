import {
    useFinance
} from '../../context/FinanceContext';

function MovementTable() {

    const {
    movimientos,
    eliminarMovimiento
    } = useFinance();

    return (

    <section className="card">

        <h3>
        Movimientos recientes
        </h3>

        <table width="100%">

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

            {
            movimientos.map((mov) => (

                <tr key={mov.id}>

                <td>
                    {mov.descripcion}
                </td>

                <td>
                    {mov.tipo}
                </td>

                <td>
                    {mov.categoria}
                </td>

                <td>
                    {mov.fecha}
                </td>


                <td>
                    ${mov.monto}
                </td>

                <td>

                    <button
                    onClick={() =>
                        eliminarMovimiento(
                        mov.id
                        )
                    }
                    >
                    Eliminar
                    </button>

                </td>

                </tr>
            ))
            }

        </tbody>

        </table>

    </section>
    );
}

export default MovementTable;