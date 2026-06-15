import { validationResult } from 'express-validator';

export const validarCampos = (req, res, next) => {
    const errores = validationResult(req);

    if (errores.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        ok: false,
        mensaje: 'Error de validación',
        errores: errores.array().map((error) => ({
        campo: error.path,
        mensaje: error.msg
        }))
    });
};