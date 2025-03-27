import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

// API versiyonu ve prefix için ortam değişkenini kullan
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Auth rotalarını kaydet
router.use(`${API_PREFIX}/auth`, authRoutes);

export default router; 