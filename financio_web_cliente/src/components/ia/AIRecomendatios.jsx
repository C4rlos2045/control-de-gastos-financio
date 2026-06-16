import { useState } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import { iaApi } from '../../services/iaApi';
import '../../styles/ai.css';

function AIRecommendations() {
  const [abierto, setAbierto] = useState(false);

  const [mensajes, setMensajes] = useState([
    {
      tipo: 'bot',
      texto:
        'Hola, soy tu asistente financiero. Puedo analizar tus movimientos reales y darte recomendaciones personalizadas.'
    }
  ]);

  const [pregunta, setPregunta] = useState('');
  const [cargando, setCargando] = useState(false);

  const agregarMensajeUsuario = (texto) => {
    setMensajes((prev) => [
      ...prev,
      {
        tipo: 'user',
        texto
      }
    ]);
  };

  const agregarMensajeBot = (texto) => {
    setMensajes((prev) => [
      ...prev,
      {
        tipo: 'bot',
        texto
      }
    ]);
  };

  const solicitarRecomendacion = async (payload) => {
    try {
      setCargando(true);

      const data =
        await iaApi.generarRecomendacion(payload);

      agregarMensajeBot(data.respuesta);
    } catch (error) {
      agregarMensajeBot(
        error.message ||
          'No fue posible generar la recomendación en este momento.'
      );
    } finally {
      setCargando(false);
    }
  };

  const manejarOpcion = (opcion, textoVisible) => {
    agregarMensajeUsuario(textoVisible);

    solicitarRecomendacion({
      opcion
    });
  };

  const enviarPregunta = (e) => {
    e.preventDefault();

    if (!pregunta.trim()) return;

    const texto = pregunta.trim();

    agregarMensajeUsuario(texto);
    setPregunta('');

    solicitarRecomendacion({
      pregunta: texto
    });
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
              <button
                onClick={() =>
                  manejarOpcion(
                    'analizar_gastos',
                    'Analiza mis gastos'
                  )
                }
                disabled={cargando}
              >
                Analiza mis gastos
              </button>

              <button
                onClick={() =>
                  manejarOpcion(
                    'recomendaciones_ahorro',
                    'Dame recomendaciones de ahorro'
                  )
                }
                disabled={cargando}
              >
                Recomendaciones de ahorro
              </button>

              <button
                onClick={() =>
                  manejarOpcion(
                    'revisar_balance',
                    'Revisa mi balance'
                  )
                }
                disabled={cargando}
              >
                Revisar balance
              </button>

              <button
                onClick={() =>
                  manejarOpcion(
                    'riesgo_financiero',
                    'Detecta riesgo financiero'
                  )
                }
                disabled={cargando}
              >
                Riesgo financiero
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
                  Consultando DeepSeek y analizando tus movimientos...
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
              onChange={(e) =>
                setPregunta(e.target.value)
              }
              disabled={cargando}
            />

            <button
              type="submit"
              disabled={cargando}
            >
              <SendIcon fontSize="small" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}

export default AIRecommendations;