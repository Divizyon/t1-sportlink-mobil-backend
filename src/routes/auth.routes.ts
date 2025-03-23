import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Yeni kullanıcı kaydı
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Kullanıcı girişi
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Kullanıcı çıkışı
 * @access  Private
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * @route   GET /api/v1/auth/user
 * @desc    Mevcut kullanıcı bilgisini getir
 * @access  Private
 */
router.get('/user', authenticateToken, authController.getUser);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Şifre sıfırlama e-postası gönder
 * @access  Public
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route   POST /api/v1/auth/update-password
 * @desc    Şifre güncelleme
 * @access  Private
 */
router.post('/update-password', authenticateToken, authController.updatePassword);

export default router; 