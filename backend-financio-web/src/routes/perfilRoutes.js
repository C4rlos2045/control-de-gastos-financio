import { Router } from 'express';

import {
    obtenerPerfil,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/perfilController.js';

import { protegerRuta } from '../middlewares/authMiddleware.js';

import {
    validarActualizacionPerfil,
    validarCambioPassword
} from '../validators/perfilValidators.js';

import { validarCampos } from '../middlewares/validationMiddleware.js';

const router = Router();

router.get(
    '/',
    protegerRuta,
    obtenerPerfil
);

router.put(
    '/',
    protegerRuta,
    validarActualizacionPerfil,
    validarCampos,
    actualizarPerfil
);

router.put(
    '/password',
    protegerRuta,
    validarCambioPassword,
    validarCampos,
    actualizarPassword
);

export default router;