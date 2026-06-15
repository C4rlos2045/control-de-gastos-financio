import { useState } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import { useFinance } from '../../context/FinanceContext';
import '../../styles/ai.css';

function AIRecommendations() {
  const { movimientos } = useFinance();

  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    {
      tipo: 'bot',
      texto: 'Hola, soy tu asistente financiero. Puedes pedirme recomendaciones sobre tus gastos, categorías o hábitos de ahorro.'
    }
  ]);
  const [pregunta, setPregunta] = useState('');
  const [cargando, setCargando] = useState(false);

  const analizarMayorGasto = () => {
    const gastos = movimientos.filter((mov) => mov.tipo === 'gasto');

    if (gastos.length === 0) {
      return 'Aún no hay suficientes gastos registrados para generar una recomendación.';
    }

    const gastosPorCategoria = {};

    gastos.forEach((mov) => {
      gastosPorCategoria[mov.categoria] =
        (gastosPorCategoria[mov.categoria] || 0) + Number(mov.monto);
    });

    const mayorGasto = Object.entries(gastosPorCategoria)
      .sort((a, b) => b[1] - a[1])[0];

    return `Detecté que tu mayor gasto está en "${mayorGasto[0]}" con un total de $${mayorGasto[1].toFixed(2)}. Te recomiendo establecer un límite semanal para esa categoría.`;
  };

  const generarRespuesta = (textoUsuario = '') => {
    setCargando(true);

    setTimeout(() => {
      let respuesta = '';

      const texto = textoUsuario.toLowerCase();

      if (texto.includes('ahorro') || texto.includes('ahorrar')) {
        respuesta =
          'Para mejorar tu ahorro, te recomiendo separar primero un porcentaje fijo de tus ingresos antes de registrar gastos variables.';
      } else if (texto.includes('gasto') || texto.includes('categoría')) {
        respuesta = analizarMayorGasto();
      } else if (texto.includes('saldo') || texto.includes('balance')) {
        const ingresos = movimientos
          .filter((mov) => mov.tipo === 'ingreso')
          .reduce((acc, mov) => acc + Number(mov.monto), 0);

        const gastos = movimientos
          .filter((mov) => mov.tipo === 'gasto')
          .reduce((acc, mov) => acc + Number(mov.monto), 0);

        respuesta = `Tu balance actual estimado es de $${(ingresos - gastos).toFixed(2)}. Mantener un saldo positivo constante es una buena señal financiera.`;
      } else {
        respuesta = analizarMayorGasto();
      }

      setMensajes((prev) => [
        ...prev,
        {
          tipo: 'bot',
          texto: respuesta
        }
      ]);

      setCargando(false);
    }, 800);
  };

  const manejarOpcion = (texto) => {
    setMensajes((prev) => [
      ...prev,
      {
        tipo: 'user',
        texto
      }
    ]);

    generarRespuesta(texto);
  };

  const enviarPregunta = (e) => {
    e.preventDefault();

    if (!pregunta.trim()) return;

    const texto = pregunta.trim();

    setMensajes((prev) => [
      ...prev,
      {
        tipo: 'user',
        texto
      }
    ]);

    setPregunta('');
    generarRespuesta(texto);
  };

  return (
    <>
      <button
        className="ai-floating-button"
        onClick={() => setAbierto(!abierto)}
        aria-label="Abrir asistente financiero"
      >
        <AutoAwesomeIcon />
      </button>

      {abierto && (
        <section className="ai-chat-window">
          <div className="ai-chat-window__header">
            <div className="ai-chat-window__title">
              <AutoAwesomeIcon />

              <div>
                <span>Asistente IA</span>
                <h3>Finanzas inteligentes</h3>
              </div>
            </div>

            <button
              className="ai-chat-window__close"
              onClick={() => setAbierto(false)}
            >
              ×
            </button>
          </div>

          <div className="ai-chat-window__body">
            <div className="ai-options">
              <button onClick={() => manejarOpcion('Analiza mis gastos')}>
                Analiza mis gastos
              </button>

              <button onClick={() => manejarOpcion('Dame recomendaciones de ahorro')}>
                Recomendaciones de ahorro
              </button>

              <button onClick={() => manejarOpcion('Revisa mi balance')}>
                Revisar balance
              </button>
            </div>

            <div className="ai-messages">
              {mensajes.map((mensaje, index) => (
                <div
                  key={index}
                  className={
                    mensaje.tipo === 'user'
                      ? 'ai-message ai-message--user'
                      : 'ai-message ai-message--bot'
                  }
                >
                  {mensaje.texto}
                </div>
              ))}

              {cargando && (
                <div className="ai-message ai-message--loading">
                  Analizando información...
                </div>
              )}
            </div>
          </div>

          <form
            className="ai-chat-window__footer"
            onSubmit={enviarPregunta}
          >
            <input
              type="text"
              placeholder="Escribe tu duda financiera..."
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
            />

            <button type="submit">
              <SendIcon fontSize="small" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}

export default AIRecommendations;