import { Router } from 'express';
import authRoutes from './auth.routes';
import healthRoutes from './health';
import userRoutes from './user.routes';
import eventRoutes from './eventRoutes';

const router = Router();

// Auth rotalarını kaydet
router.use('/api/auth', authRoutes);

// Health check rotalarını kaydet
router.use('/api', healthRoutes);

// Kullanıcı rotaları
router.use('/api/users', userRoutes);

// Etkinlik rotaları
router.use('/api/events', eventRoutes);

export default router; 