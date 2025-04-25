import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient';

// Kullanıcı ve oturum bilgilerini Request nesnesine eklemek için tip genişletme
declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    id: string;
    role: string;
  };
}

export { AuthenticatedRequest };

/**
 * JWT token'ı doğrulayan ve kullanıcı bilgisini request nesnesine ekleyen middleware
 */
export const authenticateUser = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Yetkilendirme başarısız: Token bulunamadı' });
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ message: 'Yetkilendirme başarısız: Geçersiz token' });
      return;
    }

    // User bilgilerini request nesnesine ekle
    req.user = {
      id: user.id as unknown as string,
      role: user.role as string
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Yetkilendirme başarısız' });
  }
};

// İsteğe bağlı kimlik doğrulama - token varsa doğrular, yoksa devam eder
export const optionalAuthenticateUser = async (
  req: ExpressRequest,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (!error && user) {
        req.user = {
          id: user.id as unknown as string,
          role: user.role as string
        };
      }
    }

    next();
  } catch (error) {
    next();
  }
}; 