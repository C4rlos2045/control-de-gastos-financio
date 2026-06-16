import {
    body,
    param,
    query
} from 'express-validator';

export const validarCreacionMovimiento = [
    body('categoria_id')
    .notEmpty()
    .withMessage('La categoría es obligatoria')
    .isUUID()
    .withMessage('La categoría no tiene un formato válido'),

    body('tipo')
    .notEmpty()
    .withMessage('El tipo es obligatorio')
    .isIn(['ingreso', 'gasto'])
    .withMessage('El tipo debe ser ingreso o gasto'),

    body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es obligatoria')
    .isLength({ min: 3, max: 250 })
    .withMessage(
        'La descripción debe tener entre 3 y 250 caracteres'
    ),

    body('monto')
    .notEmpty()
    .withMessage('El monto es obligatorio')
    .isFloat({ gt: 0 })
    .withMessage('El monto debe ser mayor a cero'),

    body('fecha')
    .notEmpty()
    .withMessage('La fecha es obligatoria')
    .isISO8601()
    .withMessage('La fecha debe tener formato válido YYYY-MM-DD')
];

export const validarActualizacionMovimiento = [
    param('id')
    .isUUID()
    .withMessage('El ID del movimiento no es válido'),

    body('categoria_id')
    .notEmpty()
    .withMessage('La categoría es obligatoria')
    .isUUID()
    .withMessage('La categoría no tiene un formato válido'),

    body('tipo')
    .notEmpty()
    .withMessage('El tipo es obligatorio')
    .isIn(['ingreso', 'gasto'])
    .withMessage('El tipo debe ser ingreso o gasto'),

    body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es obligatoria')
    .isLength({ min: 3, max: 250 })
    .withMessage(
        'La descripción debe tener entre 3 y 250 caracteres'
    ),

    body('monto')
    .notEmpty()
    .withMessage('El monto es obligatorio')
    .isFloat({ gt: 0 })
    .withMessage('El monto debe ser mayor a cero'),

    body('fecha')
    .notEmpty()
    .withMessage('La fecha es obligatoria')
    .isISO8601()
    .withMessage('La fecha debe tener formato válido YYYY-MM-DD')
];

export const validarIdMovimiento = [
    param('id')
    .isUUID()
    .withMessage('El ID del movimiento no es válido')
];

export const validarFiltrosMovimientos = [
    query('tipo')
    .optional({ checkFalsy: true })
    .isIn(['ingreso', 'gasto'])
    .withMessage('El tipo debe ser ingreso o gasto'),

    query('categoria_id')
    .optional({ checkFalsy: true })
    .isUUID()
    .withMessage('La categoría no tiene un formato válido'),

    query('fecha_inicio')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('La fecha inicial debe tener formato YYYY-MM-DD'),

    query('fecha_fin')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('La fecha final debe tener formato YYYY-MM-DD')
];