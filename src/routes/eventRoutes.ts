import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { EventService } from '../services/eventService';
import { authenticateUser } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { createEventSchema, updateEventSchema } from '../validations/eventValidation';
import { supabase } from '../config/supabaseClient';

const router = Router();

const eventService = new EventService(supabase);
const eventController = new EventController(eventService);

/**
 * @swagger
 * tags:
 *   name: Etkinlikler
 *   description: Etkinlik yönetimi endpoint'leri
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - sport_id
 *         - title
 *         - description
 *         - event_date
 *         - start_time
 *         - end_time
 *         - location_name
 *         - location_latitude
 *         - location_longitude
 *         - max_participants
 *       properties:
 *         id:
 *           type: number
 *           description: Etkinlik ID
 *         creator_id:
 *           type: number
 *           description: Etkinliği oluşturan kullanıcı ID
 *         sport_id:
 *           type: number
 *           description: Spor türü ID
 *         title:
 *           type: string
 *           description: Etkinlik başlığı
 *         description:
 *           type: string
 *           description: Etkinlik açıklaması
 *         event_date:
 *           type: string
 *           format: date
 *           description: Etkinlik tarihi
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: Başlangıç zamanı
 *         end_time:
 *           type: string
 *           format: date-time
 *           description: Bitiş zamanı
 *         location_name:
 *           type: string
 *           description: Konum adı
 *         location_latitude:
 *           type: number
 *           description: Konum enlem
 *         location_longitude:
 *           type: number
 *           description: Konum boylam
 *         max_participants:
 *           type: number
 *           description: Maksimum katılımcı sayısı
 *         status:
 *           type: string
 *           enum: [active, cancelled]
 *           description: Etkinlik durumu
 *         approval_status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: Onay durumu
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Tüm etkinlikleri listele
 *     tags: [Etkinlikler]
 *     parameters:
 *       - in: query
 *         name: sport_id
 *         schema:
 *           type: number
 *         description: Spor türüne göre filtrele
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Duruma göre filtrele (active, cancelled)
 *     responses:
 *       200:
 *         description: Etkinlik listesi başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       404:
 *         description: Etkinlik bulunamadı
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Belirli bir etkinliği getir
 *     tags: [Etkinlikler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Etkinlik ID
 *     responses:
 *       200:
 *         description: Etkinlik başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Etkinlik bulunamadı
 */
router.get('/:id', eventController.getEventById);

// Protected routes (require authentication)
router.use(authenticateUser);

/**
 * @swagger
 * /api/events/user/events:
 *   get:
 *     summary: Kullanıcının etkinliklerini getir
 *     tags: [Etkinlikler]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcının etkinlikleri başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: Yetkilendirme başarısız
 */
router.get('/user/events', eventController.getEventsByCreator);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Yeni etkinlik oluştur
 *     tags: [Etkinlikler]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sport_id
 *               - title
 *               - description
 *               - event_date
 *               - start_time
 *               - end_time
 *               - location_name
 *               - location_latitude
 *               - location_longitude
 *               - max_participants
 *             properties:
 *               sport_id:
 *                 type: number
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               event_date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               location_name:
 *                 type: string
 *               location_latitude:
 *                 type: number
 *               location_longitude:
 *                 type: number
 *               max_participants:
 *                 type: number
 *     responses:
 *       201:
 *         description: Etkinlik başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Geçersiz istek
 *       401:
 *         description: Yetkilendirme başarısız
 */
router.post('/', validateRequest(createEventSchema), eventController.createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Etkinlik güncelle
 *     tags: [Etkinlikler]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Etkinlik ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               event_date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               location_name:
 *                 type: string
 *               location_latitude:
 *                 type: number
 *               location_longitude:
 *                 type: number
 *               max_participants:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, cancelled]
 *     responses:
 *       200:
 *         description: Etkinlik başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Geçersiz istek
 *       401:
 *         description: Yetkilendirme başarısız
 *       404:
 *         description: Etkinlik bulunamadı
 */
router.put('/:id', validateRequest(updateEventSchema), eventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Etkinlik sil
 *     tags: [Etkinlikler]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Etkinlik ID
 *     responses:
 *       204:
 *         description: Etkinlik başarıyla silindi
 *       401:
 *         description: Yetkilendirme başarısız
 *       404:
 *         description: Etkinlik bulunamadı
 */
router.delete('/:id', eventController.deleteEvent);

// Admin routes
// TODO: Add admin middleware

/**
 * @swagger
 * /api/events/{id}/approve:
 *   post:
 *     summary: Etkinliği onayla
 *     tags: [Etkinlikler]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Etkinlik ID
 *     responses:
 *       200:
 *         description: Etkinlik başarıyla onaylandı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       401:
 *         description: Yetkilendirme başarısız
 *       404:
 *         description: Etkinlik bulunamadı
 */
router.post('/:id/approve', eventController.approveEvent);

/**
 * @swagger
 * /api/events/{id}/reject:
 *   post:
 *     summary: Etkinliği reddet
 *     tags: [Etkinlikler]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Etkinlik ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Red nedeni
 *     responses:
 *       200:
 *         description: Etkinlik başarıyla reddedildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       401:
 *         description: Yetkilendirme başarısız
 *       404:
 *         description: Etkinlik bulunamadı
 */
router.post('/:id/reject', eventController.rejectEvent);

export default router; 