import { Router } from 'express';

import {
  listarMovimientos,
  obtenerMovimientoPorId,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento
} from '../controllers/movimientosController.js';

import { protegerRuta } from '../middlewares/authMiddleware.js';
import { validarCampos } from '../middlewares/validationMiddleware.js';

import {
  validarCreacionMovimiento,
  validarActualizacionMovimiento,
  validarIdMovimiento,
  validarFiltrosMovimientos
} from '../validators/movimientosValidators.js';

const router = Router();

router.get(
  '/',
  protegerRuta,
  validarFiltrosMovimientos,
  validarCampos,
  listarMovimientos
);

router.get(
  '/:id',
  protegerRuta,
  validarIdMovimiento,
  validarCampos,
  obtenerMovimientoPorId
);

router.post(
  '/',
  protegerRuta,
  validarCreacionMovimiento,
  validarCampos,
  crearMovimiento
);

router.put(
  '/:id',
  protegerRuta,
  validarActualizacionMovimiento,
  validarCampos,
  actualizarMovimiento
);

router.delete(
  '/:id',
  protegerRuta,
  validarIdMovimiento,
  validarCampos,
  eliminarMovimiento
);

export default router;