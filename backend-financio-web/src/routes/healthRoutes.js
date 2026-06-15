import { Router } from 'express';
import { verificarServidor } from '../controllers/healthController.js';

const router = Router();

router.get('/', verificarServidor);

export default router;