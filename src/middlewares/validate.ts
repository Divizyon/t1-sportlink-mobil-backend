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