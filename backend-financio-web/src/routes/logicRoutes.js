import { Router } from 'express';

import { analizarFinanzas } from '../controllers/logicController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';
import { validarCampos } from '../middlewares/validationMiddleware.js';
import { validarFiltrosMovimientos } from '../validators/movimientosValidators.js';

const router = Router();

router.get(
    '/analisis',
    protegerRuta,
    validarFiltrosMovimientos,
    validarCampos,
    analizarFinanzas
);

router.post(
    '/analisis',
    protegerRuta,
    analizarFinanzas
);

export default router;
