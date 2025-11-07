# 🔧 .env Dosyası Hata Düzeltme Rehberi

## ❌ Olası Hatalar

### 1. Şifrede Özel Karakterler
Şifrede nokta (`.`) karakteri varsa URL encoding gerektirebilir:
- `.` → `%2E`
- `@` → `%40`
- `:` → `%3A`

### 2. Connection String Formatı
Supabase connection string formatı:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

### 3. Pooler vs Direct Connection
- **Pooler**: `aws-0-eu-central-1.pooler.supabase.com` (Connection pooling)
- **Direct**: `db.gyecknemhospwvhsicds.supabase.co` (Direct connection)

## ✅ Doğru Format

### Seçenek 1: Şifreyi URL Encode Et
```env
DATABASE_URL="postgresql://postgres.gyecknemhospwvhsicds:2%2EMuhittinSupabase@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

### Seçenek 2: Şifreyi Tırnak İçinde Kullan (Genellikle Çalışır)
```env
DATABASE_URL="postgresql://postgres.gyecknemhospwvhsicds:2.MuhittinSupabase@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

### Seçenek 3: Direct Connection Kullan (Daha Stabil)
```env
DATABASE_URL="postgresql://postgres:2.MuhittinSupabase@db.gyecknemhospwvhsicds.supabase.co:5432/postgres"
```

## 🔍 Test Etme

```bash
# Prisma generate
npm run db:generate

# Database push
npm run db:push
```

Eğer hata alırsanız, şifreyi URL encode edin.

