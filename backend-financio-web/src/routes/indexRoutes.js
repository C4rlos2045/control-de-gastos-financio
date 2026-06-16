import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import perfilRoutes from './perfilRoutes.js';
import movimientosRoutes from './movimientosRoutes.js';
import categoriasRoutes from './categoriasRoutes.js';
import reportesRoutes from './reportesRoutes.js';


const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/perfil', perfilRoutes);
router.use('/movimientos', movimientosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/reportes', reportesRoutes);
export default router;