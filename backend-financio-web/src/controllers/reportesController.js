import {
    obtenerResumenFinancieroService,
    obtenerGastosPorCategoriaService,
    obtenerMovimientosPorMesService
} from '../services/reportesService.js';

    export const obtenerResumenFinanciero = async (
    req,
    res,
    next
    ) => {
    try {
        const resumen =
        await obtenerResumenFinancieroService(
            req.usuario.id,
            req.query
        );

        return res.json({
        ok: true,
        resumen
        });
    } catch (error) {
        next(error);
    }
    };

    export const obtenerGastosPorCategoria = async (
    req,
    res,
    next
    ) => {
    try {
        const reporte =
        await obtenerGastosPorCategoriaService(
            req.usuario.id,
            req.query
        );

        return res.json({
        ok: true,
        reporte
        });
    } catch (error) {
        next(error);
    }
    };

    export const obtenerMovimientosPorMes = async (
    req,
    res,
    next
    ) => {
    try {
        const reporte =
        await obtenerMovimientosPorMesService(
            req.usuario.id,
            req.query
        );

        return res.json({
        ok: true,
        total: reporte.length,
        reporte
        });
    } catch (error) {
        next(error);
  }
};