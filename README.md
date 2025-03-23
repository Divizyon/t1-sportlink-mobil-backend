# SportLink Mobil Backend

Bu proje, SportLink mobil uygulaması için RESTful API backend hizmetini sağlar.

## Teknolojiler

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Docker

## Kurulum

### Gereksinimler

- Node.js (v16+)
- npm veya yarn
- PostgreSQL (veya Docker)

### Adımlar

1. Repoyu klonlayın:
   ```bash
   git clone https://github.com/your-username/t2-sportlink-mobil-backend.git
   cd t2-sportlink-mobil-backend
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   # veya
   yarn install
   ```

3. Çevre değişkenlerini ayarlayın:
   ```bash
   cp .env.example .env
   # .env dosyasını düzenleyin
   ```

4. Geliştirme modunda çalıştırın:
   ```bash
   npm run dev
   # veya
   yarn dev
   ```

## Kullanım

API, varsayılan olarak `http://localhost:3000/api/v1` adresinde çalışır.

### API Endpointleri

- `GET /api/v1/health` - API sağlık kontrolü
- `POST /api/v1/auth/register` - Kullanıcı kaydı
- `POST /api/v1/auth/login` - Kullanıcı girişi
- `GET /api/v1/users` - Kullanıcıları listele
- `GET /api/v1/users/:id` - Kullanıcı detaylarını getir

Daha fazla bilgi için API dokümantasyonuna bakın.

## Geliştirme

### Komutlar

- `npm run dev` - Geliştirme sunucusunu başlatır
- `npm run build` - Projeyi derler
- `npm start` - Derlenmiş uygulamayı çalıştırır
- `npm run lint` - Kod kalitesini kontrol eder
- `npm run format` - Kodu formatlar
- `npm test` - Testleri çalıştırır

### Klasör Yapısı

```
src/
├── config/         # Yapılandırma dosyaları
├── controllers/    # İstek işleyicileri
├── middlewares/    # Express ara yazılımları
├── models/         # Veri modelleri
├── routes/         # Rota tanımları
├── services/       # İş mantığı
├── types/          # TypeScript tip tanımları
├── utils/          # Yardımcı fonksiyonlar
└── app.ts          # Express uygulama kurulumu
```

## Docker ile Çalıştırma

```bash
# Docker imajını oluşturun
docker build -t sportlink-backend .

# Konteyneri çalıştırın
docker run -p 3000:3000 sportlink-backend
```

## Lisans

Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.

## Supabase Auth Entegrasyonu

Bu projede kimlik doğrulama için Supabase Auth kullanılmaktadır. Kullanıcı kaydı, girişi ve oturum yönetimi işlemleri Supabase Auth ile yapılmaktadır.

### Kurulum

1. Bir Supabase projesi oluşturun: [https://supabase.com](https://supabase.com)
2. Supabase projenizin URL ve Anon Key bilgilerini `.env` dosyasındaki ilgili alanlara ekleyin:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
APP_URL=http://localhost:3000
```

### Kullanılan Kimlik Doğrulama API'leri

Aşağıdaki API endpointleri ile kimlik doğrulama işlemleri gerçekleştirilebilir:

#### Kullanıcı Kaydı
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

#### Kullanıcı Girişi
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Kullanıcı Çıkışı
```
POST /api/v1/auth/logout
Authorization: Bearer your_jwt_token
```

#### Mevcut Kullanıcı Bilgisini Alma
```
GET /api/v1/auth/user
Authorization: Bearer your_jwt_token
```

#### Şifre Sıfırlama E-postası Gönderme
```
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Şifre Güncelleme
```
POST /api/v1/auth/update-password
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "password": "new_password123"
}
```

### Kimlik Doğrulama Akışı

1. Kullanıcı kaydı veya girişi yapıldığında, Supabase bir JWT token döndürür.
2. Bu token istemci tarafında saklanır ve her istekte `Authorization: Bearer your_jwt_token` header'ı ile gönderilir.
3. Sunucu tarafında `authenticateToken` middleware'i bu token'ı doğrular ve kullanıcı bilgisini request nesnesine ekler.
4. Korumalı rotalar için bu middleware kullanılır.

### Token Doğrulama

Uygulamanızda token doğrulama için aşağıdaki middleware'i kullanabilirsiniz:

```typescript
// Örnek korumalı rota
import { authenticateToken } from '../middlewares/auth.middleware';

router.get('/protected-route', authenticateToken, (req, res) => {
  // req.user kullanılabilir
  res.json({ user: req.user });
});
``` 