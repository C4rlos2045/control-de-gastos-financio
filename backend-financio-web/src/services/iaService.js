    import { supabase } from '../config/supabaseClient.js';
    import { env } from '../config/env.js';

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
        .order('fecha', { ascending: false })
        .limit(80);

    if (error) {
        throw new Error(
        'No fue posible obtener los movimientos para el análisis'
        );
    }

    return data || [];
    };

    const generarResumenFinanciero = (movimientos) => {
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

    const gastosPorCategoria = {};

    gastos.forEach((mov) => {
        const categoria =
        mov.categorias?.nombre || 'Sin categoría';

        if (!gastosPorCategoria[categoria]) {
        gastosPorCategoria[categoria] = {
            categoria,
            total: 0,
            cantidad: 0
        };
        }

        gastosPorCategoria[categoria].total += Number(mov.monto);
        gastosPorCategoria[categoria].cantidad += 1;
    });

    const categoriasOrdenadas =
        Object.values(gastosPorCategoria).sort(
        (a, b) => b.total - a.total
        );

    return {
        total_movimientos: movimientos.length,
        total_ingresos: Number(formatearDinero(totalIngresos)),
        total_gastos: Number(formatearDinero(totalGastos)),
        balance: Number(formatearDinero(balance)),
        cantidad_ingresos: ingresos.length,
        cantidad_gastos: gastos.length,
        porcentaje_gastos_sobre_ingresos:
        totalIngresos > 0
            ? Number(
                formatearDinero(
                (totalGastos / totalIngresos) * 100
                )
            )
            : 0,
        categoria_mayor_gasto:
        categoriasOrdenadas.length > 0
            ? {
                categoria: categoriasOrdenadas[0].categoria,
                total: Number(
                formatearDinero(categoriasOrdenadas[0].total)
                ),
                cantidad: categoriasOrdenadas[0].cantidad
            }
            : null,
        gastos_por_categoria: categoriasOrdenadas.map(
        (item) => ({
            categoria: item.categoria,
            total: Number(formatearDinero(item.total)),
            cantidad: item.cantidad
        })
        )
    };
    };

    const obtenerPreguntaPorOpcion = (opcion) => {
    const opciones = {
        analizar_gastos:
        'Analiza mis gastos y dime en qué categoría estoy gastando más.',

        recomendaciones_ahorro:
        'Dame recomendaciones de ahorro personalizadas con base en mis ingresos y gastos.',

        revisar_balance:
        'Revisa mi balance financiero y dime si mi situación es positiva o negativa.',

        riesgo_financiero:
        'Detecta si tengo riesgo financiero y explícame qué debería mejorar.'
    };

    return opciones[opcion] || opciones.analizar_gastos;
    };

    const prepararMovimientosParaIA = (movimientos) => {
    return movimientos.slice(0, 40).map((mov) => ({
        tipo: mov.tipo,
        descripcion: mov.descripcion,
        monto: Number(mov.monto),
        fecha: mov.fecha,
        categoria: mov.categorias?.nombre || 'Sin categoría'
    }));
    };

    const construirPromptSistema = () => {
    return `
    Eres un asistente financiero dentro de una aplicación llamada Financio.
    Tu tarea es generar recomendaciones claras, útiles y prudentes sobre ingresos, gastos, ahorro y balance personal.

    Reglas obligatorias:
    - Responde siempre en español.
    - Usa únicamente la información financiera proporcionada.
    - No inventes movimientos, ingresos, gastos ni datos del usuario.
    - No pidas CURP, RFC, contraseñas, correo ni datos sensibles.
    - No digas que guardaste información.
    - No des asesoría de inversión especializada.
    - No prometas resultados financieros.
    - Sé concreto, amable y práctico.
    - Si no hay datos suficientes, dilo claramente.
    - Devuelve una respuesta breve, entre 1 y 3 párrafos.
    - Puedes incluir máximo 3 recomendaciones puntuales.
    `;
    };

    const construirPromptUsuario = ({
    pregunta,
    resumen,
    movimientos
    }) => {
    return `
    Pregunta del usuario:
    ${pregunta}

    Resumen financiero calculado por el sistema:
    ${JSON.stringify(resumen, null, 2)}

    Últimos movimientos financieros:
    ${JSON.stringify(movimientos, null, 2)}

    Genera una recomendación personalizada con base en estos datos.
    `;
    };

    const llamarDeepSeek = async ({
    pregunta,
    resumen,
    movimientos,
    usuarioId
    }) => {
    const response = await fetch(
        `${env.deepseekApiUrl}/chat/completions`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.deepseekApiKey}`
        },
        body: JSON.stringify({
            model: env.deepseekModel,
            messages: [
            {
                role: 'system',
                content: construirPromptSistema()
            },
            {
                role: 'user',
                content: construirPromptUsuario({
                pregunta,
                resumen,
                movimientos
                })
            }
            ],
            stream: false,
            max_tokens: env.deepseekMaxTokens,
            temperature: env.deepseekTemperature,
            user_id: usuarioId
        })
        }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const mensaje =
        data?.error?.message ||
        'No fue posible obtener respuesta de DeepSeek';

        const error = new Error(mensaje);
        error.statusCode = 502;
        throw error;
    }

    const respuesta =
        data?.choices?.[0]?.message?.content;

    if (!respuesta) {
        const error = new Error(
        'DeepSeek no devolvió una respuesta válida'
        );
        error.statusCode = 502;
        throw error;
    }

    return {
        respuesta,
        modelo: data.model || env.deepseekModel,
        usage: data.usage || null
    };
    };

    export const generarRecomendacionIAService = async (
    usuarioId,
    datos
    ) => {
    const movimientos =
        await obtenerMovimientosUsuario(usuarioId);

    const resumen =
        generarResumenFinanciero(movimientos);

    const movimientosParaIA =
        prepararMovimientosParaIA(movimientos);

    const pregunta =
        datos.pregunta?.trim() ||
        obtenerPreguntaPorOpcion(datos.opcion);

    const resultadoDeepSeek =
        await llamarDeepSeek({
        pregunta,
        resumen,
        movimientos: movimientosParaIA,
        usuarioId
        });

    return {
        respuesta: resultadoDeepSeek.respuesta,
        modelo: resultadoDeepSeek.modelo,
        usage: resultadoDeepSeek.usage,
        analisis: {
        total_movimientos: resumen.total_movimientos,
        total_ingresos: resumen.total_ingresos,
        total_gastos: resumen.total_gastos,
        balance: resumen.balance,
        porcentaje_gastos_sobre_ingresos:
            resumen.porcentaje_gastos_sobre_ingresos,
        categoria_mayor_gasto:
            resumen.categoria_mayor_gasto
        }
    };
    };