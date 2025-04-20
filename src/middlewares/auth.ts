import { Request, Response, NextFunction } from 'express';
import supabase from '../config/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

export const authenticateUser = async (
  req: Request,
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
      id: user.id as unknown as number,
      role: user.role as string
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Yetkilendirme başarısız' });
  }
}; 