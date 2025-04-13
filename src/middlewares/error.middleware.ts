import { Request, Response, NextFunction } from 'express';

// Hata yanıtı tipi
interface ErrorResponse {
  success: boolean;
  error: string;
  stack?: string;
}

/**
 * Genel 404 hatası yakalayıcı
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Genel hata yakalayıcı
 */
export const errorHandler = (
  err: Error,
  res: Response
) => {
  // Durum kodunu belirle
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Hata yanıtı oluştur
  const errorResponse: ErrorResponse = {
    success: false,
    error: err.message
  };
  
  // Geliştirme ortamında stack trace'i ekle
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  // Hata yanıtı döndür
  res.status(statusCode).json(errorResponse);
}; 