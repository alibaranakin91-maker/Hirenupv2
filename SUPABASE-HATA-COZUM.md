# 🔧 Supabase CLI ve Database Connection Hataları - Çözüm

## ❌ Hatalar

### 1. Docker Hatası
```
failed to inspect docker image: error during connect
Docker Desktop is a prerequisite for local development
```

### 2. Database Connection Hatası
```
Error: P1001: Can't reach database server at `db.eieplxpogvckilqkryrd.supabase.co:5432`
```

## 🔍 Sorunun Nedenleri

1. **Docker Hatası**: Supabase CLI shadow database için Docker gerektiriyor (local development için)
2. **Database URL Hatası**: `.env` dosyasında yanlış database URL var

## ✅ Çözümler

### Çözüm 1: Prisma Kullan (Önerilen - Docker Gerektirmez)

Supabase CLI yerine Prisma kullanın:

```bash
# Prisma generate
npm run db:generate

# Database push (schema'yı veritabanına gönder)
npm run db:push
```

**Avantajları:**
- Docker gerektirmez
- Daha hızlı
- Zaten kurulu

### Çözüm 2: Docker Desktop Yükle (Opsiyonel)

Eğer Supabase CLI kullanmak istiyorsanız:

1. **Docker Desktop İndir:**
   - https://docs.docker.com/desktop/install/windows-install/
   - İndirip kurun
   - Docker Desktop'u başlatın

2. **Supabase CLI ile devam edin:**
   ```bash
   npx supabase db diff
   ```

### Çözüm 3: Database URL'ini Düzelt

`.env` dosyasındaki `DATABASE_URL` doğru olmalı:

```env
DATABASE_URL="postgresql://postgres.gyecknemhospwvhsicds:2%2EMuhittinSupabase@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

**Kontrol:**
- Host: `aws-0-eu-central-1.pooler.supabase.com` (pooler)
- Veya: `db.gyecknemhospwvhsicds.supabase.co` (direct)
- Port: `5432`
- Database: `postgres`
- User: `postgres.gyecknemhospwvhsicds` (pooler) veya `postgres` (direct)
- Password: `2.MuhittinSupabase` (URL encoded: `2%2EMuhittinSupabase`)

## 🚀 Önerilen Yöntem

**Prisma kullanın** - Docker gerektirmez ve daha kolay:

```bash
# 1. Prisma client generate
npm run db:generate

# 2. Schema'yı veritabanına push et
npm run db:push

# 3. Veritabanını kontrol et
npm run db:studio
```

## 📋 Kontrol Listesi

- [ ] `.env` dosyasında doğru `DATABASE_URL` var mı?
- [ ] Şifre URL encoded mı? (`2.MuhittinSupabase` → `2%2EMuhittinSupabase`)
- [ ] Supabase projesi aktif mi?
- [ ] Firewall/network bağlantısı var mı?

## ✅ Başarılı!

Prisma kullanarak Docker olmadan veritabanını yönetebilirsiniz!

