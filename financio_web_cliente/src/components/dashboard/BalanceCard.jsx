function BalanceCard({
    titulo,
    monto
}) {

    return (

    <article className="card">

        <h3>{titulo}</h3>

        <p>${monto}</p>

    </article>
    );
}

export default BalanceCard;