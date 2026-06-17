import { useEffect, useState } from 'react';
import { analizarFinanzasLogicas } from '../../services/logicAnalysisService';

const formatearDinero = (valor) =>
  `$${Number(valor || 0).toFixed(2)}`;

const obtenerTituloMovimiento = (movimiento) =>
  movimiento.descripcion ||
  movimiento.categoria ||
  'Movimiento financiero';

function ListaMovimientos({ titulo, vacio, movimientos }) {
  return (
    <div className="analisis-panel">
      <h3>{titulo}</h3>

      {movimientos.length === 0 ? (
        <p className="analisis-panel__empty">{vacio}</p>
      ) : (
        <ul>
          {movimientos.map((movimiento) => (
            <li key={movimiento.id}>
              <span>{obtenerTituloMovimiento(movimiento)}</span>
              <strong>{formatearDinero(movimiento.monto)}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AnalisisLogicoFinanciero() {
  const [analisis, setAnalisis] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerAnalisis = async () => {
      try {
        setCargando(true);
        setError('');

        const data = await analizarFinanzasLogicas();
        setAnalisis(data.analisis);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerAnalisis();
  }, []);

  if (cargando) {
    return (
      <section className="analisis-logico">
        <div className="analisis-logico__header">
          <h2>Análisis financiero lógico</h2>
          <p>Analizando movimientos financieros...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="analisis-logico analisis-logico--error">
        <div className="analisis-logico__header">
          <h2>Análisis financiero lógico</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!analisis) return null;

  const gastosPrioritarios = analisis.gastosPrioritarios || [];
  const gastosInnecesarios = analisis.gastosInnecesarios || [];
  const categoriasProblematicas =
    analisis.categoriasProblematicas || [];
  const recomendaciones = analisis.recomendaciones || [];

  return (
    <section className="analisis-logico">
      <div className="analisis-logico__header">
        <div>
          <h2>Análisis financiero lógico</h2>
          <p>
            Inferencias generadas en el backend mediante reglas Prolog.
          </p>
        </div>

        <span
          className={
            analisis.riesgoFinanciero
              ? 'analisis-logico__estado analisis-logico__estado--riesgo'
              : 'analisis-logico__estado analisis-logico__estado--estable'
          }
        >
          {analisis.riesgoFinanciero
            ? 'Riesgo detectado'
            : 'Sin riesgo crítico'}
        </span>
      </div>

      <div className="analisis-logico__resumen">
        <article className="analisis-card">
          <span className="analisis-card__label">Gastos prioritarios</span>
          <strong>{gastosPrioritarios.length}</strong>
          <p>Movimientos asociados a necesidades principales.</p>
        </article>

        <article className="analisis-card">
          <span className="analisis-card__label">Gastos innecesarios</span>
          <strong>{gastosInnecesarios.length}</strong>
          <p>Movimientos asociados a ocio o consumo no esencial.</p>
        </article>

        <article className="analisis-card">
          <span className="analisis-card__label">Categorías problemáticas</span>
          <strong>{categoriasProblematicas.length}</strong>
          <p>Categorías con sobreconsumo o posible impacto negativo.</p>
        </article>

        <article className="analisis-card">
          <span className="analisis-card__label">Recomendación</span>
          <strong>{analisis.recomendarAhorro ? 'Sí' : 'No'}</strong>
          <p>
            {analisis.recomendarAhorro
              ? 'Se recomienda revisar hábitos de consumo.'
              : 'No se detectaron patrones graves de gasto.'}
          </p>
        </article>
      </div>

      <div className="analisis-logico__detalle">
        <ListaMovimientos
          titulo="Gastos prioritarios"
          vacio="No se detectaron gastos prioritarios."
          movimientos={gastosPrioritarios}
        />

        <ListaMovimientos
          titulo="Gastos innecesarios"
          vacio="No se detectaron gastos innecesarios."
          movimientos={gastosInnecesarios}
        />

        <div className="analisis-panel">
          <h3>Categorías problemáticas</h3>

          {categoriasProblematicas.length === 0 ? (
            <p className="analisis-panel__empty">
              No hay categorías problemáticas detectadas.
            </p>
          ) : (
            <div className="analisis-tags">
              {categoriasProblematicas.map((categoria) => (
                <span key={categoria}>{categoria}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="analisis-panel">
        <h3>Recomendaciones de ahorro</h3>

        <ul>
          {recomendaciones.map((recomendacion) => (
            <li key={recomendacion}>
              <span>{recomendacion}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default AnalisisLogicoFinanciero;
