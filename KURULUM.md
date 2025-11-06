# 🚀 Hirenup Projesini Canlıya Alma Rehberi

Bu rehber, Hirenup projesini yerel olarak çalıştırmanız için gerekli tüm adımları içerir.

## 📋 Gereksinimler

- **Node.js** 18.0 veya üzeri ([İndir](https://nodejs.org/))
- **PostgreSQL** veritabanı ([İndir](https://www.postgresql.org/download/))
  - Veya ücretsiz bulut PostgreSQL (Supabase, Railway, Neon vb.)
- **npm** veya **yarn** paket yöneticisi

## 🔧 Kurulum Adımları

### 1. Bağımlılıkları Yükleyin

Proje klasöründe terminal açın ve şu komutu çalıştırın:

```bash
npm install
```

Bu komut tüm gerekli paketleri yükleyecektir (birkaç dakika sürebilir).

### 2. PostgreSQL Veritabanı Hazırlayın

#### Seçenek A: Yerel PostgreSQL

1. PostgreSQL'i bilgisayarınıza kurun
2. PostgreSQL'i başlatın
3. Yeni bir veritabanı oluşturun:

```sql
CREATE DATABASE hirenup;
```

#### Seçenek B: Ücretsiz Bulut PostgreSQL (Önerilen)

**Supabase** (Önerilen - Ücretsiz):
1. https://supabase.com adresine gidin
2. Yeni proje oluşturun
3. Settings > Database bölümünden connection string'i kopyalayın

**Railway** (Ücretsiz):
1. https://railway.app adresine gidin
2. Yeni PostgreSQL servisi oluşturun
3. Connection string'i kopyalayın

**Neon** (Ücretsiz):
1. https://neon.tech adresine gidin
2. Yeni proje oluşturun
3. Connection string'i kopyalayın

### 3. Environment Değişkenlerini Ayarlayın

`.env.local` dosyasını düzenleyin ve veritabanı bağlantı bilgilerinizi girin:

```env
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="rastgele-bir-gizli-anahtar-buraya"
```

**NEXTAUTH_SECRET oluşturmak için:**
```bash
openssl rand -base64 32
```

Veya online: https://generate-secret.vercel.app/32

### 4. OAuth Ayarları (Opsiyonel - Giriş için)

#### Google OAuth:
1. https://console.cloud.google.com/ adresine gidin
2. Yeni proje oluşturun
3. APIs & Services > Credentials
4. OAuth 2.0 Client ID oluşturun
5. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Client ID ve Secret'ı `.env.local` dosyasına ekleyin

#### Facebook OAuth:
1. https://developers.facebook.com/ adresine gidin
2. Yeni uygulama oluşturun
3. Facebook Login ekleyin
4. Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook`
5. App ID ve Secret'ı `.env.local` dosyasına ekleyin

**Not:** OAuth olmadan da devam edebilirsiniz, ancak giriş yapamazsınız. Mock verilerle test edebilirsiniz.

### 5. Veritabanını Oluşturun

```bash
# Prisma client'ı oluştur
npm run db:generate

# Veritabanı şemasını uygula
npm run db:push
```

Bu komutlar veritabanı tablolarını oluşturacaktır.

### 6. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda şu adresi açın:
**http://localhost:3000**

## ✅ Proje Çalışıyor!

Artık projeyi görebilirsiniz. İlk sayfada:
- Ana sayfa görünecek
- "Kayıt Ol" butonuna tıklayarak kayıt olabilirsiniz
- OAuth ayarları yapılmadıysa, mock kullanıcı oluşturabilirsiniz

## 🛠️ Yararlı Komutlar

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build
npm start

# Veritabanı işlemleri
npm run db:generate    # Prisma client oluştur
npm run db:push        # Şema değişikliklerini uygula
npm run db:studio      # Prisma Studio (veritabanı görüntüleyici)

# Linting
npm run lint
```

## 🔍 Veritabanını Görüntüleme

Prisma Studio ile veritabanını görsel olarak görüntüleyebilirsiniz:

```bash
npm run db:studio
```

Bu komut http://localhost:5555 adresinde bir arayüz açacaktır.

## ❓ Sorun Giderme

### Port 3000 zaten kullanılıyor
```bash
# Farklı bir port kullanın
PORT=3001 npm run dev
```

### Veritabanı bağlantı hatası
- `.env.local` dosyasındaki `DATABASE_URL`'i kontrol edin
- PostgreSQL servisinin çalıştığından emin olun
- Firewall ayarlarını kontrol edin

### Prisma hatası
```bash
# Prisma client'ı yeniden oluşturun
npm run db:generate
```

### Modül bulunamadı hatası
```bash
# node_modules'ı silip yeniden yükleyin
rm -rf node_modules package-lock.json
npm install
```

## 📱 Canlıya Alma (Production)

### Vercel (Önerilen)

1. GitHub'a projeyi push edin
2. https://vercel.com adresine gidin
3. Import project ile projeyi bağlayın
4. Environment variables ekleyin:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (production URL)
   - `NEXTAUTH_SECRET`
   - OAuth credentials

5. Deploy edin!

### Railway / Render

1. GitHub repository'yi bağlayın
2. PostgreSQL servisi ekleyin
3. Environment variables ekleyin
4. Deploy edin!

## 🎉 Başarılı!

Projeniz artık çalışıyor! Herhangi bir sorunla karşılaşırsanız, README.md dosyasına veya proje dokümantasyonuna bakabilirsiniz.

