import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generarToken = (usuario) => {
    return jwt.sign(
        {
        sub: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol
        },
        env.jwtSecret,
        {
        expiresIn: env.jwtExpiresIn
        }
    );
    };

    export const verificarToken = (token) => {
    return jwt.verify(
        token,
        env.jwtSecret
    );
};