import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import perfilRoutes from './perfilRoutes.js';
import movimientosRoutes from './movimientosRoutes.js';


const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/perfil', perfilRoutes);
router.use('/movimientos', movimientosRoutes);
export default router;