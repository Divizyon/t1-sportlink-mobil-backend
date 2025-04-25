import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticateUser } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation';
import { 
  loginSchema, 
  registerSchema, 
  resetPasswordSchema, 
  updatePasswordSchema 
} from '../validators/auth.validator';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Kimlik Doğrulama
 *   description: Kullanıcı kimlik doğrulama endpoint'leri
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Kimlik Doğrulama]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz istek
 */
router.post('/register', validateRequest(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Kimlik Doğrulama]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *       401:
 *         description: Kimlik doğrulama başarısız
 */
router.post('/login', validateRequest(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Kullanıcı çıkışı
 *     tags: [Kimlik Doğrulama]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Çıkış başarılı
 *       401:
 *         description: Yetkilendirme başarısız
 */
router.post('/logout', authenticateUser, authController.logout);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Şifre sıfırlama e-postası gönder
 *     tags: [Kimlik Doğrulama]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Şifre sıfırlama e-postası gönderildi
 *       400:
 *         description: Geçersiz istek
 */
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

/**
 * @swagger
 * /api/auth/update-password:
 *   post:
 *     summary: Şifre güncelle
 *     tags: [Kimlik Doğrulama]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Şifre başarıyla güncellendi
 *       401:
 *         description: Yetkilendirme başarısız
 */
router.post('/update-password', authenticateUser, validateRequest(updatePasswordSchema), authController.updatePassword);

export default router; 