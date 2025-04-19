import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import packageJson from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sportlink API Dokümantasyonu',
      version: packageJson.version,
      description: 'Sportlink mobil uygulaması için REST API dokümantasyonu',
      contact: {
        name: 'Sportlink Ekibi'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development API Sunucusu'
      },
      {
        url: process.env.STAGING_API_URL || 'https://api-staging.sportlink.app',
        description: 'Staging API Sunucusu'
      },
      {
        url: process.env.PRODUCTION_API_URL || 'https://api.sportlink.app',
        description: 'Production API Sunucusu'
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
      schemas: {}, // Şemalar için yer tutucu - model şemaları otomatik olarak burada toplanacak
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
        },
        BadRequestError: {
          description: 'Geçersiz istek hatası',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Geçersiz istek parametreleri'
                  },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        field: {
                          type: 'string',
                          example: 'email'
                        },
                        message: {
                          type: 'string',
                          example: 'Geçerli bir e-posta adresi girilmelidir'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        InternalServerError: {
          description: 'Sunucu hatası',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Sunucu hatası oluştu'
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
    }],
    tags: [
      {
        name: 'Auth',
        description: 'Kimlik doğrulama ve yetkilendirme işlemleri'
      },
      {
        name: 'Users',
        description: 'Kullanıcı yönetimi işlemleri'
      },
      {
        name: 'Health',
        description: 'Sistem sağlık kontrolleri'
      }
      // Yeni tag eklemek için buraya ekleyebilirsiniz
    ]
  },
  apis: [
    path.join(__dirname, '../routes/**/*.ts'),
    path.join(__dirname, '../controllers/**/*.ts'),
    path.join(__dirname, '../models/**/*.ts'),
    path.join(__dirname, '../schemas/**/*.ts'),
    path.join(__dirname, '../types/**/*.ts')
  ]
};

export const swaggerSpec = swaggerJsdoc(options); 