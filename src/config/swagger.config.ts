import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SportLink Mobil API',
      version: '1.0.0',
      description: 'SportLink Mobil uygulaması için REST API dokümantasyonu',
      contact: {
        name: 'SportLink Ekibi'
      },
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
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // API rotalarının ve kontrolcülerin yolu
};

export const swaggerSpec = swaggerJsdoc(options); 