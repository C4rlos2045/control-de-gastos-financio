import {
    body,
    param,
    query
} from 'express-validator';

export const validarCreacionCategoria = [
    body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la categoría es obligatorio')
    .isLength({ min: 3, max: 80 })
    .withMessage(
        'El nombre debe tener entre 3 y 80 caracteres'
    ),

    body('tipo')
    .notEmpty()
    .withMessage('El tipo de categoría es obligatorio')
    .isIn(['ingreso', 'gasto'])
    .withMessage('El tipo debe ser ingreso o gasto')
];

export const validarActualizacionCategoria = [
    param('id')
    .isUUID()
    .withMessage('El ID de la categoría no es válido'),

    body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la categoría es obligatorio')
    .isLength({ min: 3, max: 80 })
    .withMessage(
        'El nombre debe tener entre 3 y 80 caracteres'
    ),

    body('tipo')
    .notEmpty()
    .withMessage('El tipo de categoría es obligatorio')
    .isIn(['ingreso', 'gasto'])
    .withMessage('El tipo debe ser ingreso o gasto')
];

export const validarIdCategoria = [
    param('id')
    .isUUID()
    .withMessage('El ID de la categoría no es válido')
];

export const validarFiltrosCategorias = [
    query('tipo')
    .optional({ checkFalsy: true })
    .isIn(['ingreso', 'gasto'])
    .withMessage('El tipo debe ser ingreso o gasto')
];