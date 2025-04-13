import { Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/auth.service';
import asyncHandler from '../utils/asyncHandler';

// Validasyon şemaları
const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır')
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').optional()
});

const emailSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz')
});

const passwordSchema = z.object({
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır')
});

/**
 * Kimlik doğrulama işlemlerini yöneten kontrolcü
 */
class AuthController {
  /**
   * Yeni kullanıcı kaydı yapar
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    // Giriş verilerini doğrula
    const validatedData = registerSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({ 
        success: false, 
        error: validatedData.error.errors 
      });
    }
    
    const credentials = validatedData.data;
    
    // Kullanıcı kaydı yap
    const result = await authService.register(credentials);
    
    if (result.error) {
      return res.status(400).json({ 
        success: false, 
        error: result.error 
      });
    }
    
    return res.status(201).json({ 
      success: true, 
      data: {
        user: result.user,
        session: result.session
      }
    });
  });
  
  /**
   * Kullanıcı girişi yapar
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    // Giriş verilerini doğrula
    const validatedData = loginSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({ 
        success: false, 
        error: validatedData.error.errors 
      });
    }
    
    const credentials = validatedData.data;
    
    // Kullanıcı girişi yap
    const result = await authService.login(credentials);
    
    if (result.error) {
      return res.status(401).json({ 
        success: false, 
        error: result.error 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      data: {
        user: result.user,
        session: result.session
      }
    });
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