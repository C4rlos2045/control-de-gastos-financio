import { supabase } from '../config/supabaseClient.js';

const seleccionarMovimientoIA = `
    id,
    tipo,
    descripcion,
    monto,
    fecha,
    categorias (
        id,
        nombre,
        tipo
    )
    `;

    const formatearDinero = (valor) => {
    return Number(valor || 0).toFixed(2);
    };

    const obtenerMovimientosUsuario = async (usuarioId) => {
    const { data, error } = await supabase
        .from('movimientos')
        .select(seleccionarMovimientoIA)
        .eq('usuario_id', usuarioId)
        .order('fecha', { ascending: false });

    if (error) {
        throw new Error(
        'No fue posible obtener los movimientos para el análisis'
        );
    }

    return data || [];
    };

    const generarResumen = (movimientos) => {
    const ingresos = movimientos.filter(
        (mov) => mov.tipo === 'ingreso'
    );

    const gastos = movimientos.filter(
        (mov) => mov.tipo === 'gasto'
    );

    const totalIngresos = ingresos.reduce(
        (total, mov) => total + Number(mov.monto),
        0
    );

    const totalGastos = gastos.reduce(
        (total, mov) => total + Number(mov.monto),
        0
    );

    const balance = totalIngresos - totalGastos;

    return {
        totalMovimientos: movimientos.length,
        totalIngresos,
        totalGastos,
        balance,
        cantidadIngresos: ingresos.length,
        cantidadGastos: gastos.length
    };
};

const obtenerGastosPorCategoria = (movimientos) => {
    const gastos = movimientos.filter(
        (mov) => mov.tipo === 'gasto'
    );

    const agrupacion = {};

    gastos.forEach((mov) => {
        const categoria =
        mov.categorias?.nombre || 'Sin categoría';

        if (!agrupacion[categoria]) {
        agrupacion[categoria] = {
            categoria,
            total: 0,
            cantidad: 0
        };
        }

        agrupacion[categoria].total += Number(mov.monto);
        agrupacion[categoria].cantidad += 1;
    });

    return Object.values(agrupacion).sort(
        (a, b) => b.total - a.total
    );
};

const analizarGastos = (movimientos) => {
    const resumen = generarResumen(movimientos);
    const gastosPorCategoria =
        obtenerGastosPorCategoria(movimientos);

    if (resumen.cantidadGastos === 0) {
        return 'Aún no tienes gastos registrados. Cuando registres algunos movimientos, podré analizar en qué categorías estás gastando más.';
    }

    const mayorCategoria = gastosPorCategoria[0];

    return `Tu mayor gasto se concentra en la categoría "${mayorCategoria.categoria}", con un total de $${formatearDinero(mayorCategoria.total)}. Te recomiendo revisar si esos gastos son necesarios, establecer un límite semanal y comparar este comportamiento con tus ingresos actuales.`;
};

const recomendarAhorro = (movimientos) => {
    const resumen = generarResumen(movimientos);

    if (resumen.totalIngresos === 0) {
        return 'Aún no tienes ingresos registrados. Para darte una recomendación de ahorro más precisa, primero registra al menos un ingreso.';
    }

    const porcentajeGasto =
        (resumen.totalGastos / resumen.totalIngresos) * 100;

    if (porcentajeGasto >= 80) {
        return `Tus gastos representan aproximadamente el ${porcentajeGasto.toFixed(2)}% de tus ingresos. Esto es alto, por lo que te recomiendo reducir gastos variables y separar una cantidad fija para ahorro antes de realizar nuevos gastos.`;
    }

    if (porcentajeGasto >= 50) {
        return `Tus gastos representan aproximadamente el ${porcentajeGasto.toFixed(2)}% de tus ingresos. Vas en un punto intermedio: podrías aplicar una meta de ahorro del 10% al 20% de tus ingresos.`;
    }

    return `Tus gastos representan aproximadamente el ${porcentajeGasto.toFixed(2)}% de tus ingresos. Tu situación parece saludable; podrías aumentar tu ahorro o destinar una parte a inversión o fondo de emergencia.`;
};

const revisarBalance = (movimientos) => {
    const resumen = generarResumen(movimientos);

    if (resumen.totalMovimientos === 0) {
        return 'Aún no hay movimientos registrados para calcular tu balance financiero.';
    }

    if (resumen.balance > 0) {
        return `Tu balance actual es positivo: $${formatearDinero(resumen.balance)}. Esto indica que tus ingresos superan tus gastos. Mantén este comportamiento y procura asignar parte del excedente al ahorro.`;
    }

    if (resumen.balance < 0) {
        return `Tu balance actual es negativo: -$${formatearDinero(Math.abs(resumen.balance))}. Esto indica que tus gastos superan tus ingresos. Te recomiendo revisar tus gastos principales y reducir los menos necesarios.`;
    }

    return 'Tu balance actual está en cero. Esto significa que tus ingresos y gastos están equilibrados, pero sería recomendable generar un margen de ahorro.';
};

const detectarRiesgoFinanciero = (movimientos) => {
    const resumen = generarResumen(movimientos);

    if (resumen.totalIngresos === 0 && resumen.totalGastos > 0) {
        return 'Existe un posible riesgo financiero porque tienes gastos registrados, pero no ingresos. Registra tus ingresos para obtener un análisis más completo.';
    }

    if (resumen.totalIngresos === 0) {
        return 'No hay información suficiente para detectar riesgo financiero. Registra ingresos y gastos para realizar el análisis.';
    }

    const porcentajeGasto =
        (resumen.totalGastos / resumen.totalIngresos) * 100;

    if (porcentajeGasto >= 90) {
        return `Riesgo financiero alto: tus gastos representan el ${porcentajeGasto.toFixed(2)}% de tus ingresos. Es importante reducir gastos no prioritarios y establecer límites por categoría.`;
    }

    if (porcentajeGasto >= 70) {
        return `Riesgo financiero medio: tus gastos representan el ${porcentajeGasto.toFixed(2)}% de tus ingresos. Aún hay margen de mejora, especialmente si identificas gastos variables que puedan reducirse.`;
    }

    return `Riesgo financiero bajo: tus gastos representan el ${porcentajeGasto.toFixed(2)}% de tus ingresos. Tu situación parece estable, aunque conviene mantener hábitos de ahorro.`;
};

const responderPregunta = (
  pregunta,
  movimientos
) => {
  const texto = pregunta.toLowerCase();

  if (
    texto.includes('gasto') ||
    texto.includes('categoría') ||
    texto.includes('categoria') ||
    texto.includes('donde gasto') ||
    texto.includes('en qué gasto')
  ) {
    return analizarGastos(movimientos);
  }

  if (
    texto.includes('ahorro') ||
    texto.includes('ahorrar') ||
    texto.includes('recomienda')
  ) {
    return recomendarAhorro(movimientos);
  }

  if (
    texto.includes('balance') ||
    texto.includes('saldo') ||
    texto.includes('dinero disponible')
  ) {
    return revisarBalance(movimientos);
  }

  if (
    texto.includes('riesgo') ||
    texto.includes('problema') ||
    texto.includes('mal') ||
    texto.includes('deuda')
    ) {
    return detectarRiesgoFinanciero(movimientos);
    }

    return `Con base en tus movimientos registrados, puedo ayudarte a revisar tus gastos, analizar tu balance, detectar riesgos financieros o darte recomendaciones de ahorro. Por ahora, ${analizarGastos(movimientos)}`;
};

const generarRespuestaPorOpcion = (
    opcion,
    movimientos
) => {
    switch (opcion) {
        case 'analizar_gastos':
        return analizarGastos(movimientos);

        case 'recomendaciones_ahorro':
        return recomendarAhorro(movimientos);

        case 'revisar_balance':
        return revisarBalance(movimientos);

        case 'riesgo_financiero':
        return detectarRiesgoFinanciero(movimientos);

        default:
        return analizarGastos(movimientos);
    }
};

export const generarRecomendacionIAService = async (
    usuarioId,
    datos
    ) => {
    const movimientos =
        await obtenerMovimientosUsuario(usuarioId);

    const resumen = generarResumen(movimientos);
    const gastosPorCategoria =
        obtenerGastosPorCategoria(movimientos);

    let respuesta;

    if (datos.pregunta) {
        respuesta = responderPregunta(
        datos.pregunta,
        movimientos
        );
    } else {
        respuesta = generarRespuestaPorOpcion(
        datos.opcion,
        movimientos
        );
    }

    return {
        respuesta,
        analisis: {
        total_movimientos: resumen.totalMovimientos,
        total_ingresos: Number(
            formatearDinero(resumen.totalIngresos)
        ),
        total_gastos: Number(
            formatearDinero(resumen.totalGastos)
        ),
        balance: Number(
            formatearDinero(resumen.balance)
        ),
        categoria_mayor_gasto:
            gastosPorCategoria.length > 0
            ? {
                categoria: gastosPorCategoria[0].categoria,
                total: Number(
                    formatearDinero(gastosPorCategoria[0].total)
                ),
                cantidad: gastosPorCategoria[0].cantidad
                }
            : null
        }
    };
};