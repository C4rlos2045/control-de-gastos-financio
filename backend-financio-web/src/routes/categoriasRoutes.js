import { Router } from 'express';

import {
    listarCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} from '../controllers/categoriasController.js';

import { protegerRuta } from '../middlewares/authMiddleware.js';
import { validarCampos } from '../middlewares/validationMiddleware.js';

import {
    validarCreacionCategoria,
    validarActualizacionCategoria,
    validarIdCategoria,
    validarFiltrosCategorias
} from '../validators/categoriasValidators.js';

const router = Router();

router.get(
    '/',
    protegerRuta,
    validarFiltrosCategorias,
    validarCampos,
    listarCategorias
);

router.get(
    '/:id',
    protegerRuta,
    validarIdCategoria,
    validarCampos,
    obtenerCategoriaPorId
);

router.post(
    '/',
    protegerRuta,
    validarCreacionCategoria,
    validarCampos,
    crearCategoria
);

router.put(
    '/:id',
    protegerRuta,
    validarActualizacionCategoria,
    validarCampos,
    actualizarCategoria
);

router.delete(
    '/:id',
    protegerRuta,
    validarIdCategoria,
    validarCampos,
    eliminarCategoria
);

export default router;