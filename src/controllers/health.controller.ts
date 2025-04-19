import { Request, Response } from 'express';

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "OK"
 *         environment:
 *           type: string
 *           example: "development"
 *         version:
 *           type: string
 *           example: "1.0.0"
 *         timestamp:
 *           type: string
 *           format: date-time
 *         uptime:
 *           type: number
 *           example: 3600
 *         memory:
 *           type: object
 *           properties:
 *             rss:
 *               type: string
 *               example: "56 MB"
 *             heapTotal:
 *               type: string
 *               example: "21 MB"
 *             heapUsed:
 *               type: string
 *               example: "19 MB"
 */

/**
 * Sistem durumunu kontrol eder
 */
export const getHealthStatus = (_req: Request, res: Response): void => {
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
    }
  });
};

/**
 * Detaylı sistem bilgisi sunar
 */
export const getDetailedHealth = (_req: Request, res: Response): void => {
  const startTime = new Date(Date.now() - process.uptime() * 1000);
  
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    startTime: startTime.toISOString(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    pid: process.pid,
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch
    }
  });
}; 