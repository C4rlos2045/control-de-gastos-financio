import { verificarToken } from '../utils/jwt.js';
import { supabase } from '../config/supabaseClient.js';

export const protegerRuta = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token no proporcionado'
        });
        }

        const [tipo, token] = authHeader.split(' ');

        if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Formato de token inválido'
        });
        }

        const payload = verificarToken(token);

        const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('id, nombre, correo, rol, activo')
        .eq('id', payload.sub)
        .single();

        if (error || !usuario) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Usuario no encontrado o token inválido'
        });
        }

        if (!usuario.activo) {
        return res.status(403).json({
            ok: false,
            mensaje: 'La cuenta se encuentra desactivada'
        });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(401).json({
        ok: false,
        mensaje: 'Token inválido o expirado'
        });
    }
};

export const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Usuario no autenticado'
        });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({
            ok: false,
            mensaje: 'No tienes permisos para realizar esta acción'
        });
        }

        next();
    };
};