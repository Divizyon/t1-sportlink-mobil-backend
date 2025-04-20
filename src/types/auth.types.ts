import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Validasyon hatası',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          })),
          code: 'VALIDATION_ERROR'
        });
      } else {
        res.status(500).json({
          message: 'Sunucu hatası',
          code: 'SERVER_ERROR'
        });
      }
    }
  };
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface AuthError {
  success: boolean;
  message: string;
} 