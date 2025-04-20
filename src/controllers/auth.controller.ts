import { Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/auth.service';
import asyncHandler from '../utils/asyncHandler';
import { supabase } from '../lib/supabase';
import { LoginRequest, LoginResponse } from '../types/auth.types';

// Validasyon şemaları
const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır')
});

const registerSchema = z.object({
  name: z.string().min(3, 'İsim en az 3 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir')
    .regex(/[^A-Za-z0-9]/, 'Şifre en az bir özel karakter içermelidir'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword']
});

const emailSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz')
});

const passwordSchema = z.object({
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır')
});

/**
 * Yeni kullanıcı kaydı yapar
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: validatedData.name
        }
      }
    });

    if (error) {
      if (error.message.includes('email')) {
        res.status(400).json({
          success: false,
          message: 'Bu e-posta adresi zaten kullanılıyor',
          errors: {
            email: 'Bu e-posta adresi ile daha önce kayıt olunmuş'
          }
        });
        return;
      }

      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı. Lütfen giriş yapınız.',
      userId: data.user?.id
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: error.errors.reduce((acc, curr) => ({
          ...acc,
          [curr.path[0]]: curr.message
        }), {})
      });
      return;
    }

    console.error('Kayıt hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      errors: {
        general: 'Beklenmeyen bir hata oluştu'
      }
    });
  }
};

/**
 * Kimlik doğrulama işlemlerini yöneten kontrolcü
 */
class AuthController {
  /**
   * Kullanıcı girişi yapar
   */
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Kullanıcı girişi yapar
   *     tags: [Auth]
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
   *                 example: deneme@sportlink.com
   *                 description: Kullanıcının email adresi
   *               password:
   *                 type: string
   *                 format: password
   *                 example: Deneme1234!
   *                 description: Kullanıcının şifresi
   *     responses:
   *       200:
   *         description: Başarılı giriş
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: u1
   *                     username:
   *                       type: string
   *                       example: denemeKullanici
   *                     email:
   *                       type: string
   *                       example: deneme@sportlink.com
   *                     name:
   *                       type: string
   *                       example: Ali Yılmaz
   *                     avatar:
   *                       type: string
   *                       example: https://randomuser.me/api/portraits/men/32.jpg
   *                     role:
   *                       type: string
   *                       example: user
   *       401:
   *         description: Giriş başarısız
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
   *                   example: Geçersiz e-posta veya şifre. Lütfen tekrar deneyiniz.
   */
  login = asyncHandler(async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
    try {
      const validatedData = loginSchema.parse(req.body);

      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        res.status(401).json({
          success: false,
          message: 'Geçersiz e-posta veya şifre. Lütfen tekrar deneyiniz.'
        });
        return;
      }

      if (!user || !session) {
        res.status(401).json({
          success: false,
          message: 'Kullanıcı bulunamadı.'
        });
        return;
      }

      const response: LoginResponse = {
        success: true,
        token: session.access_token,
        user: {
          id: user.id,
          email: user.email!,
          username: user.user_metadata?.username || user.email!.split('@')[0],
          name: user.user_metadata?.name || 'Kullanıcı',
          avatar: user.user_metadata?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
          role: user.role || 'user'
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Sunucu hatası oluştu.'
      });
    }
  });
  
  /**
   * Kullanıcı çıkışı yapar
   */
  logout = asyncHandler(async (_: Request, res: Response) => {
    const result = await authService.logout();
    
    if (result.error) {
      return res.status(400).json({ 
        success: false, 
        error: result.error 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Çıkış başarılı' 
    });
  });
  
  /**
   * Mevcut kullanıcı bilgisini alır
   */
  getUser = asyncHandler(async (_: Request, res: Response) => {
    const { user, error } = await authService.getCurrentUser();
    
    if (error) {
      return res.status(401).json({ 
        success: false, 
        error 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      data: { user } 
    });
  });
  
  /**
   * Şifre sıfırlama talebi oluşturur
   */
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    // E-posta doğrula
    const validatedData = emailSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({ 
        success: false, 
        error: validatedData.error.errors 
      });
    }
    
    const { email } = validatedData.data;
    
    // Şifre sıfırlama e-postası gönder
    const result = await authService.resetPassword({ email });
    
    if (result.error) {
      return res.status(400).json({ 
        success: false, 
        error: result.error 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi' 
    });
  });
  
  /**
   * Şifreyi günceller
   */
  updatePassword = asyncHandler(async (req: Request, res: Response) => {
    // Şifre doğrula
    const validatedData = passwordSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({ 
        success: false, 
        error: validatedData.error.errors 
      });
    }
    
    const { password } = validatedData.data;
    
    // Şifreyi güncelle
    const result = await authService.updatePassword({ password });
    
    if (result.error) {
      return res.status(400).json({ 
        success: false, 
        error: result.error 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Şifre başarıyla güncellendi' 
    });
  });
}

export default new AuthController(); 