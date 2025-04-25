import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import asyncHandler from '../utils/asyncHandler';
import { LoginRequest, LoginResponse } from '../types/auth.types';
import { registerSchema, loginSchema, emailSchema, passwordSchema } from '../validators/auth.validator';
import { AppError } from '../utils/appError';

const authServiceInstance = new AuthService();

/**
 * Kimlik doğrulama işlemlerini yöneten kontrolcü
 */
class AuthController {
  /**
   * Yeni kullanıcı kaydı yapar
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { user, session } = await authServiceInstance.register(validatedData);

      return res.status(201).json({
        success: true,
        message: 'Kullanıcı başarıyla oluşturuldu.',
        data: {
          user,
          session
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validasyon hatası',
          errors: error.errors
        });
      }

      throw error;
    }
  });

  /**
   * Kullanıcı girişi yapar
   */
  login = asyncHandler(async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<Response> => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { user, session } = await authServiceInstance.login(validatedData);

      if (!user || !session) {
        throw new AppError('Kullanıcı girişi başarısız', 401);
      }

      const response: LoginResponse = {
        success: true,
        token: session.access_token,
        user: {
          id: user.id,
          email: user.email || '',
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
          name: user.user_metadata?.name || 'Kullanıcı',
          avatar: user.user_metadata?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
          role: user.role || 'user'
        }
      };

      return res.status(200).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validasyon hatası',
          errors: error.errors
        });
      }

      throw error;
    }
  });

  /**
   * Kullanıcı çıkışı yapar
   */
  logout = asyncHandler(async (_: Request, res: Response) => {
    await authServiceInstance.logout();
    return res.status(200).json({
      success: true,
      message: 'Çıkış başarılı'
    });
  });

  /**
   * Mevcut kullanıcı bilgisini alır
   */
  getUser = asyncHandler(async (_: Request, res: Response) => {
    const { user, error } = await authServiceInstance.getCurrentUser();

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
    try {
      const validatedData = emailSchema.parse(req.body);
      await authServiceInstance.resetPassword(validatedData);

      return res.status(200).json({
        success: true,
        message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validasyon hatası',
          errors: error.errors
        });
      }

      throw error;
    }
  });

  /**
   * Şifreyi günceller
   */
  updatePassword = asyncHandler(async (req: Request, res: Response) => {
    try {
      const validatedData = passwordSchema.parse(req.body);
      await authServiceInstance.updatePassword(validatedData);

      return res.status(200).json({
        success: true,
        message: 'Şifre başarıyla güncellendi'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validasyon hatası',
          errors: error.errors
        });
      }

      throw error;
    }
  });
}

export default new AuthController(); 