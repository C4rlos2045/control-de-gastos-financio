function MovementTable() {

    const movimientos = [
    {
        id: 1,
        descripcion: 'Supermercado',
        monto: 1200
    },

    {
        id: 2,
        descripcion: 'Gasolina',
        monto: 800
    },

    {
        id: 3,
        descripcion: 'Internet',
        monto: 500
    }
    ];

    return (

    <section className="card">

        <h3>Movimientos recientes</h3>

        <table width="100%">

        <thead>

            <tr>
            <th>Descripción</th>
            <th>Monto</th>
            </tr>

        </thead>

        <tbody>

            {
            movimientos.map((mov) => (

                <tr key={mov.id}>

                <td>{mov.descripcion}</td>

                <td>${mov.monto}</td>

                </tr>
            ))
            }

        </tbody>

        </table>

    </section>
    );
}

export default MovementTable;