import { Router } from 'express';
import authRoutes from './auth.routes';
import healthRoutes from './health';
import userRoutes from './user.routes';

const router = Router();

// Auth rotalarını kaydet
router.use('/api/auth', authRoutes);

// Health check rotalarını kaydet
router.use('/api', healthRoutes);

// Kullanıcı rotalarını kaydet
router.use('/api/users', userRoutes);

export default router; 