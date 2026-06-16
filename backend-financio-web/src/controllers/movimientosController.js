import {
    listarMovimientosService,
    obtenerMovimientoPorIdService,
    crearMovimientoService,
    actualizarMovimientoService,
    eliminarMovimientoService
    } from '../services/movimientosService.js';

    export const listarMovimientos = async (
    req,
    res,
    next
    ) => {
    try {
        const movimientos =
        await listarMovimientosService(
            req.usuario.id,
            req.query
        );

        return res.json({
        ok: true,
        total: movimientos.length,
        movimientos
        });
    } catch (error) {
        next(error);
    }
    };

    export const obtenerMovimientoPorId = async (
    req,
    res,
    next
    ) => {
    try {
        const movimiento =
        await obtenerMovimientoPorIdService(
            req.usuario.id,
            req.params.id
        );

        return res.json({
        ok: true,
        movimiento
        });
    } catch (error) {
        next(error);
    }
    };

    export const crearMovimiento = async (
    req,
    res,
    next
    ) => {
    try {
        const movimiento =
        await crearMovimientoService(
            req.usuario.id,
            req.body
        );

        return res.status(201).json({
        ok: true,
        mensaje: 'Movimiento creado correctamente',
        movimiento
        });
    } catch (error) {
        next(error);
    }
    };

    export const actualizarMovimiento = async (
    req,
    res,
    next
    ) => {
    try {
        const movimiento =
        await actualizarMovimientoService(
            req.usuario.id,
            req.params.id,
            req.body
        );

        return res.json({
        ok: true,
        mensaje: 'Movimiento actualizado correctamente',
        movimiento
        });
    } catch (error) {
        next(error);
    }
    };

    export const eliminarMovimiento = async (
    req,
    res,
    next
    ) => {
    try {
        const resultado =
        await eliminarMovimientoService(
            req.usuario.id,
            req.params.id
        );

        return res.json({
        ok: true,
        mensaje: 'Movimiento eliminado correctamente',
        id: resultado.id
        });
    } catch (error) {
        next(error);
    }
};