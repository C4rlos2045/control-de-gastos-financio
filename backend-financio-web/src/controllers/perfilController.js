import {
    obtenerPerfilService,
    actualizarPerfilService,
    actualizarPasswordService,
    actualizarAvatarService
    } from '../services/perfilService.js';

    export const obtenerPerfil = async (
    req,
    res,
    next
    ) => {
    try {
        const usuario = await obtenerPerfilService(
        req.usuario.id
        );

        return res.json({
        ok: true,
        usuario
        });
    } catch (error) {
        next(error);
    }
    };

    export const actualizarPerfil = async (
    req,
    res,
    next
    ) => {
    try {
        const usuario = await actualizarPerfilService(
        req.usuario.id,
        req.body
        );

        return res.json({
        ok: true,
        mensaje: 'Perfil actualizado correctamente',
        usuario
        });
    } catch (error) {
        next(error);
    }
    };

    export const actualizarAvatar = async (
    req,
    res,
    next
    ) => {
    try {
        const usuario =
        await actualizarAvatarService(
            req.usuario.id,
            req.file
        );

        return res.json({
        ok: true,
        mensaje: 'Avatar actualizado correctamente',
        usuario
        });
    } catch (error) {
        next(error);
    }
    };

    export const actualizarPassword = async (
    req,
    res,
    next
    ) => {
    try {
        const {
        passwordActual,
        nuevaPassword
        } = req.body;

        const resultado =
        await actualizarPasswordService(
            req.usuario.id,
            passwordActual,
            nuevaPassword
        );

        return res.json({
        ok: true,
        mensaje: resultado.mensaje
        });
    } catch (error) {
        next(error);
    }
};