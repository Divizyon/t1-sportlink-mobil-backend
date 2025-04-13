import { Request, Response, NextFunction } from 'express';
import supabase from '../config/supabase';

// Kullanıcı ve oturum bilgilerini Request nesnesine eklemek için tip genişletme
declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

/**
 * JWT token'ı doğrulayan ve kullanıcı bilgisini request nesnesine ekleyen middleware
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Authorization header'dan token'ı al
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Yetkilendirme başlığı eksik'
      });
    }
    
    // Bearer token'ı ayır
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Erişim token\'ı eksik'
      });
    }
    
    // Token'ı doğrula ve kullanıcı bilgisini al
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        error: error?.message || 'Geçersiz veya süresi dolmuş token'
      });
    }
    
    // Session bilgisini al
    const { data: sessionData } = await supabase.auth.getSession();
    
    // Kullanıcı ve oturum bilgisini request'e ekle
    req.user = data.user;
    req.session = sessionData.session;
    
    return next();
  } catch (error) {
    const errorMessage = 
      error instanceof Error ? error.message : 'Kimlik doğrulama hatası';
    
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
};

/**
 * Request header'ındaki JWT token'ı doğrulayan ancak zorunlu tutmayan middleware.
 * İsteğe bağlı kimlik doğrulama için kullanılır.
 */
export const optionalAuthenticateToken = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    // Authorization header'dan token'ı al
    const authHeader = req.headers.authorization;
    
    // Token yoksa devam et
    if (!authHeader) {
      return next();
    }
    
    // Bearer token'ı ayır
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next();
    }
    
    // Token'ı doğrula ve kullanıcı bilgisini al
    const { data, error } = await supabase.auth.getUser(token);
    
    // Token geçerli değilse sessiz bir şekilde devam et
    if (error || !data.user) {
      return next();
    }
    
    // Session bilgisini al
    const { data: sessionData } = await supabase.auth.getSession();
    
    // Kullanıcı ve oturum bilgisini request'e ekle
    req.user = data.user;
    req.session = sessionData.session;
    
    next();
  } catch (error) {
    // Hata durumunda sessizce devam et
    next();
  }
}; 