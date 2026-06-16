import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import perfilRoutes from './perfilRoutes.js';


const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/perfil', perfilRoutes);

export default router;