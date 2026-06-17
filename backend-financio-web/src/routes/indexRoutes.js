import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import perfilRoutes from './perfilRoutes.js';
import movimientosRoutes from './movimientosRoutes.js';
import categoriasRoutes from './categoriasRoutes.js';
import reportesRoutes from './reportesRoutes.js';
import iaRoutes from './iaRoutes.js';
import logicRoutes from './logicRoutes.js';


const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/perfil', perfilRoutes);
router.use('/movimientos', movimientosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/reportes', reportesRoutes);
router.use('/ia', iaRoutes);
router.use('/logica', logicRoutes);
router.use('/logic', logicRoutes);
export default router;
