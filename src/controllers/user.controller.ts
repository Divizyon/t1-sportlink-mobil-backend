import { Request, Response } from 'express';

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
 *                     description: Kullanıcı ID
 *                   name:
 *                     type: string
 *                     description: Kullanıcı adı
 *                   email:
 *                     type: string
 *                     description: E-posta adresi
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
export const getUsers = async (_req: Request, res: Response) => {
  try {
    // Kullanıcı listesini getir
    const users = [
      { id: '1', name: 'Test Kullanıcı', email: 'test@example.com' }
    ];
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ 
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
 *         description: Kullanıcı ID
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
 *                   description: Kullanıcı ID
 *                 name:
 *                   type: string
 *                   description: Kullanıcı adı
 *                 email:
 *                   type: string
 *                   description: E-posta adresi
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
    
    // Örnek kullanıcı verisi
    const user = { 
      id, 
      name: 'Test Kullanıcı', 
      email: 'test@example.com' 
    };
    
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