import express from 'express';
import SecurityController from '../controllers/SecurityController';
import { isAdmin } from '../middleware/authMiddleware';

// Bu dosya, admin/yönetici tarafından kullanılan güvenlik log endpoint'lerini içerir
// Ancak artık routes/index.ts'de bağlantısı olmadığından API'da erişilemez durumdadır
// Swagger dokümantasyonundan da kaldırılmıştır

const router = express.Router();

// GET /api/security/logs - Güvenlik loglarını listele
router.get('/logs', SecurityController.getLogs);

// POST /api/security/logs - Yeni güvenlik logu oluştur
router.post('/logs', SecurityController.createLog);

// DELETE /api/security/logs/:id - Güvenlik logunu sil 
router.delete('/logs/:id', SecurityController.deleteLog);

export default router; 