import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Async fonksiyonlar için hata yakalayıcı sarmalayıcı
 * Bu fonksiyon, async controller fonksiyonlarının hatalarını yakalar ve next() fonksiyonuna iletir
 * @param fn Controller fonksiyonu
 * @returns Sarmalanmış controller fonksiyonu
 */
const asyncHandler = (fn: RequestHandler) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler; 
//s