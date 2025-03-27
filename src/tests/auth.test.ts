import request from 'supertest';
import app from '../app';

describe('Auth Endpoints', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      // Not: Bu test gerçek bir API çağrısı yapar ve Supabase veritabanında gerçek kullanıcı oluşturur.
      // Test amacıyla gerçekleştirilirken dikkatli olunmalıdır.
      // Testlerde genellikle mock veya test veritabanı kullanılmalıdır.
      
      // Test için kullanılacak rastgele e-posta
      const email = `test${Math.floor(Math.random() * 10000)}@example.com`;
      
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email,
          password: 'password123',
          name: 'Test User'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('session');
    });
    
    it('should return validation error for invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should return validation error for short password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('POST /api/v1/auth/login', () => {
    it('should login user with valid credentials', async () => {
      // Not: Bu test bir önceki testte oluşturulan kullanıcıya bağlıdır.
      // İdeal olarak, her test öncesinde test veritabanını sıfırlamalı
      // ve bilinen test kullanıcıları oluşturmalısınız.
      
      // Gerçek bir test ortamında önce kullanıcı oluşturup sonra bu kullanıcı ile giriş yapmalısınız
      const email = `login_test${Math.floor(Math.random() * 10000)}@example.com`;
      const password = 'password123';
      
      // Önce kullanıcı oluştur
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email,
          password,
          name: 'Login Test User'
        });
      
      // Şimdi giriş yap
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email,
          password
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('session');
    });
    
    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 