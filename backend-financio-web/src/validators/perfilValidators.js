import { body } from 'express-validator';

export const validarActualizacionPerfil = [
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

    body('telefono')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 20 })
        .withMessage(
        'El teléfono no debe exceder 20 caracteres'
        ),

    body('direccion')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 300 })
        .withMessage(
        'La dirección no debe exceder 300 caracteres'
        ),

    body('curp')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 18, max: 18 })
        .withMessage('La CURP debe tener 18 caracteres'),

    body('rfc')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 12, max: 13 })
        .withMessage(
        'El RFC debe tener entre 12 y 13 caracteres'
        ),

    body('avatar_url')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage(
        'La URL del avatar no debe exceder 500 caracteres'
        )
    ];

    export const validarCambioPassword = [
    body('passwordActual')
        .notEmpty()
        .withMessage(
        'La contraseña actual es obligatoria'
        ),

    body('nuevaPassword')
        .notEmpty()
        .withMessage(
        'La nueva contraseña es obligatoria'
        )
        .isLength({ min: 6 })
        .withMessage(
        'La nueva contraseña debe tener mínimo 6 caracteres'
        ),

    body('confirmarPassword')
        .notEmpty()
        .withMessage(
        'La confirmación de contraseña es obligatoria'
        )
        .custom((valor, { req }) => {
        if (valor !== req.body.nuevaPassword) {
            throw new Error(
            'La nueva contraseña y su confirmación no coinciden'
            );
        }

        return true;
    })
];