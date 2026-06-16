import {
    listarCategoriasService,
    obtenerCategoriaPorIdService,
    crearCategoriaService,
    actualizarCategoriaService,
    eliminarCategoriaService
} from '../services/categoriasService.js';

export const listarCategorias = async (
    req,
    res,
    next
    ) => {
    try {
        const categorias =
        await listarCategoriasService(
            req.usuario.id,
            req.query
        );

        return res.json({
        ok: true,
        total: categorias.length,
        categorias
        });
    } catch (error) {
        next(error);
    }
    };

    export const obtenerCategoriaPorId = async (
    req,
    res,
    next
    ) => {
    try {
        const categoria =
        await obtenerCategoriaPorIdService(
            req.usuario.id,
            req.params.id
        );

        return res.json({
        ok: true,
        categoria
        });
    } catch (error) {
        next(error);
    }
    };

    export const crearCategoria = async (
    req,
    res,
    next
    ) => {
    try {
        const categoria =
        await crearCategoriaService(
            req.usuario.id,
            req.body
        );

        return res.status(201).json({
        ok: true,
        mensaje: 'Categoría creada correctamente',
        categoria
        });
    } catch (error) {
        next(error);
    }
    };

    export const actualizarCategoria = async (
    req,
    res,
    next
    ) => {
    try {
        const categoria =
        await actualizarCategoriaService(
            req.usuario.id,
            req.params.id,
            req.body
        );

        return res.json({
        ok: true,
        mensaje: 'Categoría actualizada correctamente',
        categoria
        });
    } catch (error) {
        next(error);
    }
    };

    export const eliminarCategoria = async (
    req,
    res,
    next
    ) => {
    try {
        const categoria =
        await eliminarCategoriaService(
            req.usuario.id,
            req.params.id
        );

        return res.json({
        ok: true,
        mensaje: 'Categoría eliminada correctamente',
        categoria
        });
    } catch (error) {
        next(error);
    }
};