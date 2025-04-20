import express, { Application } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { notFound } from './middlewares/error.middleware';
import routes from './routes';
import { swaggerMiddleware } from './middlewares/swagger.middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';
import { seedDatabase } from './utils/seedData';
import logger from './utils/logger';

// Ortam değişkenlerini yükle
dotenv.config();

// Express uygulamasını başlat
const app: Application = express();

// Sunucu port'unu belirle
const PORT = process.env.PORT || 3000;

// Middleware'leri ekle
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(morgan('dev'));

// Rate limiter yapılandır
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 dakika varsayılan
  max: Number(process.env.RATE_LIMIT_MAX) || 100, // IP başına limit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'İstek limiti aşıldı, lütfen daha sonra tekrar deneyin'
  }
});

// Tüm rotalar için rate limiter uygula
app.use(limiter);

// Swagger dokümantasyonunu ekle
app.use(swaggerMiddleware);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotaları ekle
app.use(routes);

// 404 middleware'i ekle
app.use(notFound);

// Uygulama başladığında seed işlemini gerçekleştir
(async () => {
  try {
    await seedDatabase();
  } catch (error) {
    logger.error('Failed to seed database:', error);
  }
})();

// Sunucuyu başlat
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

export default app;
