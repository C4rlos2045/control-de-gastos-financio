import { body } from 'express-validator';

export const validarRegistro = [
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isLength({ min: 3, max: 120 })
        .withMessage(
        'El nombre debe tener entre 3 y 120 caracteres'
        ),

    body('correo')
        .trim()
        .notEmpty()
        .withMessage('El correo es obligatorio')
        .isEmail()
        .withMessage('El correo no tiene un formato válido')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 })
        .withMessage(
        'La contraseña debe tener mínimo 6 caracteres'
        )
    ];

    export const validarLogin = [
    body('correo')
        .trim()
        .notEmpty()
        .withMessage('El correo es obligatorio')
        .isEmail()
        .withMessage('El correo no tiene un formato válido')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
    ];

    export const validarActualizacionPassword = [
    body('passwordActual')
        .notEmpty()
        .withMessage('La contraseña actual es obligatoria'),

    body('nuevaPassword')
        .notEmpty()
        .withMessage('La nueva contraseña es obligatoria')
        .isLength({ min: 6 })
        .withMessage(
        'La nueva contraseña debe tener mínimo 6 caracteres'
        )
];