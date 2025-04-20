import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { register } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Yeni kullanıcı kaydı
 *     description: Yeni bir kullanıcı hesabı oluşturur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 example: "Ahmet Yılmaz"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ahmet@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "Test123!@#"
 *               confirmPassword:
 *                 type: string
 *                 example: "Test123!@#"
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Kayıt başarılı. Lütfen giriş yapınız."
 *                 userId:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *       400:
 *         description: Validasyon hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validasyon hatası"
 *                 errors:
 *                   type: object
 *                   example:
 *                     email: "Geçerli bir e-posta adresi giriniz"
 *                     password: "Şifre en az 8 karakter olmalıdır"
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Sunucu hatası"
 *                 errors:
 *                   type: object
 *                   example:
 *                     general: "Beklenmeyen bir hata oluştu"
 */
router.post('/register', register);

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