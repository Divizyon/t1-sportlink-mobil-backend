import { Router } from 'express';
import { getHealthStatus, getDetailedHealth } from '../controllers/health.controller';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: API sağlık kontrolü
 *     description: API'nin çalışır durumda olup olmadığını kontrol eder
 *     responses:
 *       200:
 *         description: API çalışıyor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/health', getHealthStatus);

/**
 * @swagger
 * /api/health/details:
 *   get:
 *     tags:
 *       - Health
 *     summary: Detaylı sistem durumu
 *     description: Sistemin detaylı durumunu ve performans metriklerini sunar
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detaylı sistem durumu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 environment:
 *                   type: string
 *                 uptime:
 *                   type: number
 *                 memory:
 *                   type: object
 *                 cpu:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/health/details', getDetailedHealth);

export default router; 