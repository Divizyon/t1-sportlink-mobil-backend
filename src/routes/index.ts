import { Router } from 'express';
import authRoutes from './auth.routes';
import healthRoutes from './health';
import userRoutes from './user.routes';

const router = Router();

// API versiyonu ve prefix için ortam değişkenini kullan
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Auth rotalarını kaydet
router.use(`${API_PREFIX}/auth`, authRoutes);

// Sağlık kontrolü
router.use('/api', healthRoutes);

router.use('/api/users', userRoutes);

export default router; 