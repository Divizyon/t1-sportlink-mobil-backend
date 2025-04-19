import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger.config';

const router = Router();

// Swagger UI özelleştirme seçenekleri
const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }', // Üst çubuğu gizle
  customSiteTitle: 'SportLink API Dokümantasyonu',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    displayRequestDuration: true,
  },
};

// Swagger JSON endpoint'i
router.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Swagger UI endpoint'i
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

export const swaggerMiddleware = router; 