import { Router } from 'express';
import { getUsers, getUserById } from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Kullanıcılar
 *   description: Kullanıcı yönetimi endpoint'leri
 */

router.get('/', getUsers);
router.get('/:id', getUserById);

export default router; 