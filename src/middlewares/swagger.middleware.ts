import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger';

const router = Router();

const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
  customSiteTitle: 'Sportlink API Dokümantasyonu',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: process.env.NODE_ENV !== 'production'
  }
};

// Sadece development ortamında Swagger UI'ı etkinleştir
if (process.env.NODE_ENV !== 'production') {
  router.use('/api-docs', swaggerUi.serve);
  router.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

  // Swagger JSON endpoint
  router.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

export const swaggerMiddleware = router; 