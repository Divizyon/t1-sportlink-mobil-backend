import { Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/auth.service';
import asyncHandler from '../utils/asyncHandler';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { LoginRequest, LoginResponse } from '../types/auth.types';
import { registerSchema } from '../validators/auth.validator';
import { ValidationError } from '../utils/errors';

// Validasyon şemaları
const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır')
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
export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Admin client ile kullanıcı oluştur (otomatik login olmadan)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      user_metadata: {
        email_confirmed: true
      },
      email_confirm: true // Email'i otomatik onayla
    });

    if (authError) {
      throw authError;
    }

    return res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu. Giriş yapabilirsiniz.',
      data: {
        id: authData.user.id,
        email: authData.user.email
      }
    });

  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: (error as ValidationError).errors
      });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: (error as z.ZodError).errors
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Kullanıcı oluşturulurken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
}

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

      console.log('Login attempt for:', validatedData.email);

      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        console.log('Login error:', error);
        res.status(401).json({
          success: false,
          message: 'Geçersiz e-posta veya şifre. Lütfen tekrar deneyiniz.'
        });
        return;
      }

      if (!user || !session) {
        console.log('No user or session found');
        res.status(401).json({
          success: false,
          message: 'Kullanıcı bulunamadı.'
        });
        return;
      }

      console.log('User logged in successfully:', user.id);

      // Kullanıcının public.users tablosunda olup olmadığını kontrol et
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      console.log('Existing user check:', { existingUser, checkError });

      // Eğer kullanıcı public.users tablosunda yoksa ekle
      if (!existingUser) {
        console.log('Attempting to insert user into public.users');
        const userData = {
          id: user.id,
          email: user.email,
          username: user.email?.split('@')[0] || 'user',
          first_name: 'Kullanıcı',
          last_name: 'Kullanıcı',
          phone: '0000000000',
          profile_picture: 'https://randomuser.me/api/portraits/men/32.jpg',
          default_location_latitude: 0,
          default_location_longitude: 0,
          role: 'USER',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        console.log('User data to insert:', userData);

        const { error: insertError } = await supabaseAdmin
          .from('users')
          .insert([userData]);

        console.log('Insert result:', { insertError });

        if (insertError) {
          console.error('Public users tablosuna ekleme hatası:', insertError);
        }
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