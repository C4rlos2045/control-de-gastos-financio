import { supabase } from '../config/supabaseClient.js';

const seleccionarMovimientoReporte = `
    id,
    tipo,
    descripcion,
    monto,
    fecha,
    creado_en,
    categorias (
        id,
        nombre,
        tipo
    )
    `;

    const obtenerMovimientosDelUsuario = async (
    usuarioId,
    filtros = {}
    ) => {
    const {
        fecha_inicio,
        fecha_fin
    } = filtros;

    let consulta = supabase
        .from('movimientos')
        .select(seleccionarMovimientoReporte)
        .eq('usuario_id', usuarioId)
        .order('fecha', { ascending: true });

    if (fecha_inicio) {
        consulta = consulta.gte('fecha', fecha_inicio);
    }

    if (fecha_fin) {
        consulta = consulta.lte('fecha', fecha_fin);
    }

    const { data, error } = await consulta;

    if (error) {
        throw new Error(
        'No fue posible obtener los datos para el reporte'
        );
    }

    return data || [];
    };

    const formatearDinero = (valor) => {
    return Number(valor.toFixed(2));
    };

    export const obtenerResumenFinancieroService = async (
    usuarioId,
    filtros
    ) => {
    const movimientos =
        await obtenerMovimientosDelUsuario(
        usuarioId,
        filtros
        );

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

    const promedioIngreso =
        ingresos.length > 0
        ? totalIngresos / ingresos.length
        : 0;

    const promedioGasto =
        gastos.length > 0
        ? totalGastos / gastos.length
        : 0;

    const porcentajeGastosSobreIngresos =
        totalIngresos > 0
        ? (totalGastos / totalIngresos) * 100
        : 0;

    return {
        total_movimientos: movimientos.length,
        total_ingresos: formatearDinero(totalIngresos),
        total_gastos: formatearDinero(totalGastos),
        balance: formatearDinero(balance),
        cantidad_ingresos: ingresos.length,
        cantidad_gastos: gastos.length,
        promedio_ingreso: formatearDinero(promedioIngreso),
        promedio_gasto: formatearDinero(promedioGasto),
        porcentaje_gastos_sobre_ingresos:
        formatearDinero(porcentajeGastosSobreIngresos)
    };
    };

    export const obtenerGastosPorCategoriaService = async (
    usuarioId,
    filtros
    ) => {
    const movimientos =
        await obtenerMovimientosDelUsuario(
        usuarioId,
        filtros
        );

    const gastos = movimientos.filter(
        (mov) => mov.tipo === 'gasto'
    );

    const totalGastos = gastos.reduce(
        (total, mov) => total + Number(mov.monto),
        0
    );

    const agrupacion = {};

    gastos.forEach((mov) => {
        const categoriaId =
        mov.categorias?.id || 'sin_categoria';

        const categoriaNombre =
        mov.categorias?.nombre || 'Sin categoría';

        if (!agrupacion[categoriaId]) {
        agrupacion[categoriaId] = {
            categoria_id: categoriaId,
            categoria: categoriaNombre,
            total: 0,
            cantidad: 0,
            porcentaje: 0
        };
        }

        agrupacion[categoriaId].total += Number(mov.monto);
        agrupacion[categoriaId].cantidad += 1;
    });

    const resultado = Object.values(agrupacion)
        .map((item) => ({
        ...item,
        total: formatearDinero(item.total),
        porcentaje:
            totalGastos > 0
            ? formatearDinero(
                (item.total / totalGastos) * 100
                )
            : 0
        }))
        .sort((a, b) => b.total - a.total);

    return {
        total_gastos: formatearDinero(totalGastos),
        categorias: resultado
    };
    };

    export const obtenerMovimientosPorMesService = async (
    usuarioId,
    filtros
    ) => {
    const movimientos =
        await obtenerMovimientosDelUsuario(
        usuarioId,
        filtros
        );

    const agrupacion = {};

    movimientos.forEach((mov) => {
        const mes = mov.fecha.slice(0, 7);

        if (!agrupacion[mes]) {
        agrupacion[mes] = {
            mes,
            ingresos: 0,
            gastos: 0,
            balance: 0,
            total_movimientos: 0
        };
        }

        if (mov.tipo === 'ingreso') {
        agrupacion[mes].ingresos += Number(mov.monto);
        }

        if (mov.tipo === 'gasto') {
        agrupacion[mes].gastos += Number(mov.monto);
        }

        agrupacion[mes].total_movimientos += 1;
    });

    const resultado = Object.values(agrupacion)
        .map((item) => ({
        mes: item.mes,
        ingresos: formatearDinero(item.ingresos),
        gastos: formatearDinero(item.gastos),
        balance: formatearDinero(
            item.ingresos - item.gastos
        ),
        total_movimientos: item.total_movimientos
        }))
        .sort((a, b) => a.mes.localeCompare(b.mes));

    return resultado;
};