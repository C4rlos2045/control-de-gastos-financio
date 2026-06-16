import {
    generarRecomendacionIAService
} from '../services/iaService.js';

export const generarRecomendacionIA = async (
    req,
    res,
    next
    ) => {
    try {
        const resultado =
        await generarRecomendacionIAService(
            req.usuario.id,
            req.body
        );

        return res.json({
        ok: true,
        mensaje: 'Recomendación generada correctamente',
        respuesta: resultado.respuesta,
        analisis: resultado.analisis
        });
    } catch (error) {
        next(error);
    }
    };