import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sportlink API Dokümantasyonu',
      version: '1.0.0',
      description: 'Sportlink mobil uygulaması için REST API dokümantasyonu',
      contact: {
        name: 'Sportlink Ekibi'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'API Sunucusu'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {}, // Şemalarınız için yer tutucu
      responses: {
        UnauthorizedError: {
          description: 'Kimlik doğrulama hatası',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Yetkisiz erişim'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    path.join(__dirname, '../routes/**/*.ts'),
    path.join(__dirname, '../models/**/*.ts'),
    path.join(__dirname, '../schemas/**/*.ts')
  ]
};

export const swaggerSpec = swaggerJsdoc(options); 