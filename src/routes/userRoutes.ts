import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  getUserDetails,
  toggleUserStatusController,
  deleteUserController,
  sendWarningToUserController,
  toggleUserWatch,
  getUsersByRoleController,
  freezeAccountController,
  deleteAccountController,
  getUserOwnReportsController
} from '../controllers/UserController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 */

// All user routes are protected
router.use(protect);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users. Only accessible to administrators.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *             example:
 *               users:
 *                 - id: 550e8400-e29b-41d4-a716-446655440000
 *                   email: admin@example.com
 *                   first_name: Admin
 *                   last_name: User
 *                   role: admin
 *                   created_at: 2023-01-01T00:00:00.000Z
 *                   updated_at: 2023-01-01T00:00:00.000Z
 *                 - id: 550e8400-e29b-41d4-a716-446655440001
 *                   email: user@example.com
 *                   first_name: John
 *                   last_name: Doe
 *                   role: user
 *                   created_at: 2023-01-02T00:00:00.000Z
 *                   updated_at: 2023-01-02T00:00:00.000Z
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', restrictTo('ADMIN'), getAllUsers);

/**
 * @swagger
 * /api/users/role/user:
 *   get:
 *     summary: USER rolündeki kullanıcıları listele
 *     description: Sadece USER rolüne sahip kullanıcıları sayfalandırılmış olarak getirir
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Listelenmek istenen sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Sayfa başına gösterilecek kullanıcı sayısı
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [mixed, new, active]
 *           default: mixed
 *         description: Sıralama türü - mixed (karışık), new (yeni kayıtlı), active (aktif kullanıcılar)
 *     responses:
 *       200:
 *         description: Kullanıcılar başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           email:
 *                             type: string
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                           role:
 *                             type: string
 *                           event_count:
 *                             type: integer
 *                             description: Kullanıcının katıldığı etkinlik sayısı (sadece mixed sıralamada)
 *                     meta:
 *                       type: object
 *                       properties:
 *                         totalCount:
 *                           type: integer
 *                           description: Toplam kullanıcı sayısı
 *                         page:
 *                           type: integer
 *                           description: Mevcut sayfa
 *                         limit:
 *                           type: integer
 *                           description: Sayfa başına kullanıcı sayısı
 *                         totalPages:
 *                           type: integer
 *                           description: Toplam sayfa sayısı
 *                         sortBy:
 *                           type: string
 *                           description: Kullanılan sıralama türü
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/role/user', getUsersByRoleController);

/**
 * @swagger
 * /api/users/{id}/details:
 *   get:
 *     summary: Get detailed user information
 *     description: Retrieve detailed information about a specific user including their events, favorite categories, and more.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the user
 *     responses:
 *       200:
 *         description: Detailed user information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     status:
 *                       type: string
 *                     is_watched:
 *                       type: boolean
 *                     watched_since:
 *                       type: string
 *                       nullable: true
 *                     joinDate:
 *                       type: string
 *                       format: date
 *                     avatar:
 *                       type: string
 *                     profile_picture:
 *                       type: string
 *                     registeredDate:
 *                       type: string
 *                       format: date
 *                     lastActive:
 *                       type: string
 *                       format: date
 *                     gender:
 *                       type: string
 *                     birthday_date:
 *                       type: string
 *                       format: date
 *                       description: User's birthday date
 *                     address:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     eventCount:
 *                       type: integer
 *                     completedEvents:
 *                       type: integer
 *                     favoriteCategories:
 *                       type: array
 *                       items:
 *                         type: string
 *                     events:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           date:
 *                             type: string
 *                             format: date-time
 *                           status:
 *                             type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id/details', protect, getUserDetails);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve detailed information about a specific user. Users can only access their own profile, while admins can access any profile.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the user
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               user:
 *                 id: 550e8400-e29b-41d4-a716-446655440000
 *                 email: user@example.com
 *                 first_name: John
 *                 last_name: Doe
 *                 role: user
 *                 created_at: 2023-01-01T00:00:00.000Z
 *                 updated_at: 2023-01-01T00:00:00.000Z
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', protect, getUserById);

/**
 * @swagger
 * /api/users/account/freeze:
 *   post:
 *     summary: Hesabı dondur
 *     description: Kullanıcı hesabını dondurur. Hesap, 30 gün içinde giriş yapılmazsa inactive durumuna geçer. 30 gün içinde giriş yapıldığında aynı bilgilerle devam edilebilir.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hesap dondurma işlemi başarılı
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
 *                   example: Hesabınız donduruldu. 30 gün içinde giriş yapmazsanız hesabınız devre dışı kalacaktır.
 *       401:
 *         description: Yetkilendirme hatası
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
 *                   example: Bu işlemi gerçekleştirmek için giriş yapmalısınız
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
 *                   example: Hesap dondurma işlemi sırasında bir hata oluştu
 *                 error:
 *                   type: string
 */
router.post('/account/freeze', protect, freezeAccountController);

/**
 * @swagger
 * /api/users/account/delete:
 *   post:
 *     summary: Hesabı sil
 *     description: Kullanıcı hesabını siler (inactive durumuna alır). KVKK gereği kullanıcı verileri tamamen silinmez, sadece hesap devre dışı bırakılır.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hesap silme işlemi başarılı
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
 *                   example: Hesabınız başarıyla devre dışı bırakıldı. KVKK gereği verileriniz sistemde saklanacaktır.
 *       401:
 *         description: Yetkilendirme hatası
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
 *                   example: Bu işlemi gerçekleştirmek için giriş yapmalısınız
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
 *                   example: Hesap silme işlemi sırasında bir hata oluştu
 *                 error:
 *                   type: string
 */
router.post('/account/delete', protect, deleteAccountController);

/**
 * @swagger
 * /api/users/my-reports:
 *   get:
 *     summary: Kullanıcının kendi gönderdiği raporları görüntüle
 *     description: Kullanıcının gönderdiği kullanıcı ve etkinlik raporlarını listeler
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı raporları başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userReports:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           tip:
 *                             type: string
 *                           durum:
 *                             type: string
 *                           aciklama:
 *                             type: string
 *                           tarih:
 *                             type: string
 *                           raporlanan_tip:
 *                             type: string
 *                           raporlanan:
 *                             type: string
 *                           raporlanan_email:
 *                             type: string
 *                           raporlanan_id:
 *                             type: string
 *                     eventReports:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           tip:
 *                             type: string
 *                           durum:
 *                             type: string
 *                           aciklama:
 *                             type: string
 *                           tarih:
 *                             type: string
 *                           raporlanan_tip:
 *                             type: string
 *                           raporlanan:
 *                             type: string
 *                           raporlanan_tarih:
 *                             type: string
 *                           raporlanan_durum:
 *                             type: string
 *                           raporlanan_id:
 *                             type: string
 *                     totalCount:
 *                       type: number
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
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
 *                 error:
 *                   type: string
 */
router.get('/my-reports', getUserOwnReportsController);

// Kullanıcı durumunu değiştir (aktif/inaktif) (Swagger'dan kaldırıldı)
router.patch('/:userId/toggle-status', protect, restrictTo('ADMIN'), toggleUserStatusController);

// Kullanıcıyı sil (Swagger'dan kaldırıldı)
router.delete('/delete', protect, restrictTo('ADMIN'), deleteUserController);

// Kullanıcıya uyarı gönder (Swagger'dan kaldırıldı)
router.post('/:userId/warning', protect, restrictTo('ADMIN'), sendWarningToUserController);

// İzleme durumunu değiştir (Swagger'dan kaldırıldı)
router.put('/:userId/watch', restrictTo('ADMIN'), toggleUserWatch);

export default router;