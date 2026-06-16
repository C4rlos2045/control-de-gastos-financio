import { Router } from 'express';

import {
    registrarUsuario,
    loginUsuario,
    obtenerSesion
} from '../controllers/authController.js';

import {
    validarRegistro,
    validarLogin
} from '../validators/authValidators.js';

import { validarCampos } from '../middlewares/validationMiddleware.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';
import { limitadorAuth } from '../middlewares/rateLimitMiddleware.js';

const router = Router();

router.post(
    '/register',
    limitadorAuth,
    validarRegistro,
    validarCampos,
    registrarUsuario
);

router.post(
    '/login',
    limitadorAuth,
    validarLogin,
    validarCampos,
    loginUsuario
);

router.get(
    '/me',
    protegerRuta,
    obtenerSesion
);

export default router;