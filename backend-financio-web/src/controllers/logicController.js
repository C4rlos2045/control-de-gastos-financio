import { listarMovimientosService } from '../services/movimientosService.js';
import { consultarProlog } from '../services/logicService.js';

const CATEGORIAS_PRIORITARIAS = new Set([
    'comida',
    'transporte',
    'salud',
    'educacion',
    'renta',
    'servicios'
]);

const CATEGORIAS_OCIO = new Set([
    'entretenimiento',
    'compras'
]);

const normalizarAtom = (valor) =>
    String(valor ?? 'otros')
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/^([0-9])/, 'id_$1') || 'otros';

const construirHechos = (usuarioId, movimientos) => {
    const usuario = normalizarAtom(usuarioId);
    const mapaMovimientos = new Map();

    const hechosTransacciones = movimientos
        .map((movimiento, index) => {
            const idProlog = `m${index + 1}`;
            const categoria = normalizarAtom(
                movimiento.categorias?.nombre
            );
            const tipo = normalizarAtom(movimiento.tipo);
            const monto = Number(movimiento.monto) || 0;

            mapaMovimientos.set(idProlog, movimiento);

            return `transaccion(${usuario}, ${idProlog}, ${categoria}, ${monto}, ${tipo}).`;
        })
        .join('\n');

    return {
        usuario,
        mapaMovimientos,
        hechos: `usuario(${usuario}).\n${hechosTransacciones}`
    };
};

const extraerValores = (respuestas, variable) => {
    const regex = new RegExp(`${variable}\\s*=\\s*([a-zA-Z0-9_]+)`, 'i');

    return respuestas
        .map((respuesta) => respuesta.match(regex)?.[1])
        .filter(Boolean);
};

const eliminarDuplicados = (lista) => [...new Set(lista)];

const formatearMovimiento = (movimiento) => ({
    id: movimiento.id,
    categoria: movimiento.categorias?.nombre ?? 'Sin categoria',
    tipo: movimiento.tipo,
    descripcion: movimiento.descripcion,
    monto: Number(movimiento.monto),
    fecha: movimiento.fecha
});

const resolverMovimientos = (idsProlog, mapaMovimientos) =>
    idsProlog
        .map((idProlog) => mapaMovimientos.get(idProlog))
        .filter(Boolean)
        .map(formatearMovimiento);

const construirRecomendaciones = ({
    gastosInnecesarios,
    categoriasProblematicas,
    riesgoFinanciero
}) => {
    const recomendaciones = [];

    if (gastosInnecesarios.length > 0) {
        recomendaciones.push(
            'Reducir gastos de ocio o compras no esenciales detectados en el periodo.'
        );
    }

    if (categoriasProblematicas.length > 0) {
        recomendaciones.push(
            `Revisar limites de gasto en: ${categoriasProblematicas.join(', ')}.`
        );
    }

    if (riesgoFinanciero) {
        recomendaciones.push(
            'Priorizar obligaciones basicas y pausar gastos variables hasta recuperar saldo.'
        );
    }

    if (recomendaciones.length === 0) {
        recomendaciones.push(
            'Mantener el nivel actual de gasto y separar una parte fija de los ingresos para ahorro.'
        );
    }

    return recomendaciones;
};

const obtenerFiltrosAnalisis = (req) => ({
    ...req.query,
    ...req.body
});

export const analizarFinanzas = async (req, res, next) => {
    try {
        const filtros = obtenerFiltrosAnalisis(req);
        const movimientos = await listarMovimientosService(
            req.usuario.id,
            filtros
        );

        const {
            usuario,
            hechos,
            mapaMovimientos
        } = construirHechos(req.usuario.id, movimientos);

        const [
            respuestasPrioritarios,
            respuestasInnecesarios,
            respuestasCategorias,
            respuestasRecomendacion,
            respuestasRiesgo
        ] = await Promise.all([
            consultarProlog(hechos, `gasto_prioritario(${usuario}, Id).`),
            consultarProlog(hechos, `gasto_innecesario(${usuario}, Id).`),
            consultarProlog(hechos, `categoria_problematica(${usuario}, C).`),
            consultarProlog(hechos, `recomendar_ahorro(${usuario}).`),
            consultarProlog(hechos, `riesgo_financiero(${usuario}).`)
        ]);

        const idsPrioritarios = extraerValores(
            respuestasPrioritarios,
            'Id'
        );
        const idsInnecesarios = extraerValores(
            respuestasInnecesarios,
            'Id'
        );
        const categoriasProblematicas = eliminarDuplicados(
            extraerValores(respuestasCategorias, 'C')
        );
        const recomendarAhorro = respuestasRecomendacion.length > 0;
        const riesgoFinanciero = respuestasRiesgo.length > 0;
        const gastosPrioritarios = resolverMovimientos(
            idsPrioritarios,
            mapaMovimientos
        );
        const gastosInnecesarios = resolverMovimientos(
            idsInnecesarios,
            mapaMovimientos
        );

        const resumen = movimientos.reduce(
            (acumulado, movimiento) => {
                const monto = Number(movimiento.monto) || 0;
                const categoria = normalizarAtom(
                    movimiento.categorias?.nombre
                );

                if (movimiento.tipo === 'ingreso') {
                    acumulado.totalIngresos += monto;
                }

                if (movimiento.tipo === 'gasto') {
                    acumulado.totalGastos += monto;

                    if (CATEGORIAS_PRIORITARIAS.has(categoria)) {
                        acumulado.totalGastosPrioritarios += monto;
                    }

                    if (CATEGORIAS_OCIO.has(categoria)) {
                        acumulado.totalGastosNoEsenciales += monto;
                    }
                }

                return acumulado;
            },
            {
                totalIngresos: 0,
                totalGastos: 0,
                totalGastosPrioritarios: 0,
                totalGastosNoEsenciales: 0
            }
        );

        resumen.saldo = resumen.totalIngresos - resumen.totalGastos;

        return res.json({
            ok: true,
            usuarioId: req.usuario.id,
            totalMovimientos: movimientos.length,
            filtros,
            analisis: {
                gastosPrioritarios,
                gastosInnecesarios,
                categoriasProblematicas,
                recomendarAhorro,
                recomendaciones: construirRecomendaciones({
                    gastosInnecesarios,
                    categoriasProblematicas,
                    riesgoFinanciero
                }),
                riesgoFinanciero,
                nivelRiesgo: riesgoFinanciero ? 'alto' : 'bajo',
                resumen
            }
        });
    } catch (error) {
        next(error);
    }
};
