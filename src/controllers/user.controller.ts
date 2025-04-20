import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabaseClient';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Tüm kullanıcıları listele
 *     tags: [Kullanıcılar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı listesi başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Kullanıcı UUID
 *                   instance_id:
 *                     type: string
 *                     description: Instance ID
 *                   email:
 *                     type: string
 *                     description: E-posta adresi
 *                   phone:
 *                     type: string
 *                     description: Telefon numarası
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Hesap oluşturma tarihi
 *                   confirmed_at:
 *                     type: string
 *                     format: date-time
 *                     description: E-posta onay tarihi
 *                   last_sign_in_at:
 *                     type: string
 *                     format: date-time
 *                     description: Son giriş tarihi
 *                   role:
 *                     type: string
 *                     description: Kullanıcı rolü
 *                   email_confirmed_at:
 *                     type: string
 *                     format: date-time
 *                     description: E-posta onay tarihi
 *                   phone_confirmed_at:
 *                     type: string
 *                     format: date-time
 *                     description: Telefon onay tarihi
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Kullanıcılar getirilirken bir hata oluştu' 
    });
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Belirli bir kullanıcıyı getir
 *     tags: [Kullanıcılar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanıcı UUID
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Kullanıcı UUID
 *                 instance_id:
 *                   type: string
 *                   description: Instance ID
 *                 email:
 *                   type: string
 *                   description: E-posta adresi
 *                 phone:
 *                   type: string
 *                   description: Telefon numarası
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Hesap oluşturma tarihi
 *                 confirmed_at:
 *                   type: string
 *                   format: date-time
 *                   description: E-posta onay tarihi
 *                 last_sign_in_at:
 *                   type: string
 *                   format: date-time
 *                   description: Son giriş tarihi
 *                 role:
 *                   type: string
 *                   description: Kullanıcı rolü
 *                 email_confirmed_at:
 *                   type: string
 *                   format: date-time
 *                   description: E-posta onay tarihi
 *                 phone_confirmed_at:
 *                   type: string
 *                   format: date-time
 *                   description: Telefon onay tarihi
 *       404:
 *         description: Kullanıcı bulunamadı
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(id);
    
    if (error) {
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Kullanıcı bulunamadı' 
      });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Kullanıcı getirilirken bir hata oluştu' 
    });
  }
}; 