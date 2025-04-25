import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { User, Session } from '@supabase/supabase-js';

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

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
    avatar: string;
    role: string;
  };
}

export interface AuthResponse {
  user: User;
  session: Session;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  password: string;
}

export type RegisterCredentials = RegisterRequest;
export type LoginCredentials = LoginRequest;
export type ResetPasswordCredentials = ResetPasswordRequest;
export type UpdatePasswordCredentials = UpdatePasswordRequest;

export interface AuthError {
  success: boolean;
  message: string;
} 