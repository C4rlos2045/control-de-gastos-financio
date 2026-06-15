function BalanceCard({
  titulo,
  monto,
  tipo = 'neutral',
  icono
}) {
  return (
    <article className={`balance-card balance-card--${tipo}`}>
      <div className="balance-card__top">
        <span className="balance-card__icon">
          {icono}
        </span>

        <h3>
          {titulo}
        </h3>
      </div>

      <p className="balance-card__amount">
        ${Number(monto).toFixed(2)}
      </p>
    </article>
  );
}

export default BalanceCard;