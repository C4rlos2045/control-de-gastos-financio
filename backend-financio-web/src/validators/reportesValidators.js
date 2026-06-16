import { query } from 'express-validator';

export const validarFiltrosReportes = [
    query('fecha_inicio')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('La fecha inicial debe tener formato YYYY-MM-DD'),

    query('fecha_fin')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('La fecha final debe tener formato YYYY-MM-DD'),

    query('fecha_fin')
    .optional({ checkFalsy: true })
    .custom((fechaFin, { req }) => {
        const fechaInicio = req.query.fecha_inicio;

        if (
        fechaInicio &&
        new Date(fechaFin) < new Date(fechaInicio)
        ) {
        throw new Error(
            'La fecha final no puede ser menor que la fecha inicial'
        );
        }

        return true;
    })
];