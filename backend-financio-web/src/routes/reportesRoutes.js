import { Router } from 'express';

import {
    obtenerResumenFinanciero,
    obtenerGastosPorCategoria,
    obtenerMovimientosPorMes
} from '../controllers/reportesController.js';

import { protegerRuta } from '../middlewares/authMiddleware.js';
import { validarCampos } from '../middlewares/validationMiddleware.js';
import { validarFiltrosReportes } from '../validators/reportesValidators.js';

const router = Router();

router.get(
    '/resumen',
    protegerRuta,
    validarFiltrosReportes,
    validarCampos,
    obtenerResumenFinanciero
);

router.get(
    '/gastos-categoria',
    protegerRuta,
    validarFiltrosReportes,
    validarCampos,
    obtenerGastosPorCategoria
);

router.get(
    '/movimientos-mes',
    protegerRuta,
    validarFiltrosReportes,
    validarCampos,
    obtenerMovimientosPorMes
);

export default router;