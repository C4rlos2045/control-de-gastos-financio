import {
    registrarUsuarioService,
    loginUsuarioService,
    obtenerSesionService
    } from '../services/authService.js';

    export const registrarUsuario = async (
    req,
    res,
    next
    ) => {
    try {
        const { nombre, correo, password } = req.body;

        const resultado =
        await registrarUsuarioService({
            nombre,
            correo,
            password
        });

        return res.status(201).json({
        ok: true,
        mensaje: 'Usuario registrado correctamente',
        usuario: resultado.usuario,
        token: resultado.token
        });
    } catch (error) {
        next(error);
    }
    };

    export const loginUsuario = async (
    req,
    res,
    next
    ) => {
    try {
        const { correo, password } = req.body;

        const resultado = await loginUsuarioService({
        correo,
        password
        });

        return res.json({
        ok: true,
        mensaje: 'Inicio de sesión correcto',
        usuario: resultado.usuario,
        token: resultado.token
        });
    } catch (error) {
        next(error);
    }
    };

    export const obtenerSesion = async (
    req,
    res,
    next
    ) => {
    try {
        const usuario = await obtenerSesionService(
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