import { Router } from 'express';

import {
    generarRecomendacionIA
} from '../controllers/iaController.js';

import { protegerRuta } from '../middlewares/authMiddleware.js';
import { validarCampos } from '../middlewares/validationMiddleware.js';

import {
    validarRecomendacionIA
} from '../validators/iaValidators.js';

const router = Router();

router.post(
    '/recomendacion',
    protegerRuta,
    validarRecomendacionIA,
    validarCampos,
    generarRecomendacionIA
);

export default router;