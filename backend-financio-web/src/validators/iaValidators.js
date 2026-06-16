import { body } from 'express-validator';

export const validarRecomendacionIA = [
    body('pregunta')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
        'La pregunta no debe exceder 500 caracteres'
        ),

    body('opcion')
        .optional({ checkFalsy: true })
        .isIn([
        'analizar_gastos',
        'recomendaciones_ahorro',
        'revisar_balance',
        'riesgo_financiero'
        ])
        .withMessage('La opción seleccionada no es válida')
];