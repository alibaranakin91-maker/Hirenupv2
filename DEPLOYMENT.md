# 🚀 Deployment Guide - www.hirenup.com

Bu rehber, Hirenup projesini `www.hirenup.com` domain'ine deploy etmek için gerekli adımları içerir.

## 📋 Ön Gereksinimler

1. **Domain**: `www.hirenup.com` domain'inin sahibi olmalısınız
2. **Hosting**: Vercel, Railway, Render veya benzeri bir hosting servisi
3. **Database**: PostgreSQL veritabanı (Supabase, Railway, Neon vb.)
4. **OAuth Credentials**: Google ve Facebook OAuth uygulamaları

## 🔧 Domain Yapılandırması

### 1. DNS Ayarları

Domain'inizi hosting servisinize yönlendirmek için DNS kayıtlarınızı güncelleyin:

**Vercel için:**
- A Record: `@` → Vercel IP adresi
- CNAME Record: `www` → `cname.vercel-dns.com`

**Railway/Render için:**
- CNAME Record: `www` → hosting servisinizin verdiği URL

### 2. SSL Sertifikası

Modern hosting servisleri (Vercel, Railway, Render) otomatik olarak SSL sertifikası sağlar. Domain'inizi bağladığınızda otomatik olarak HTTPS aktif olur.

## 🔐 Environment Variables

Production ortamında şu environment variable'ları ayarlayın:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/hirenup?schema=public"

# NextAuth - Production URL
NEXTAUTH_URL="https://www.hirenup.com"
NEXTAUTH_SECRET="your-production-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
```

## 🔑 OAuth Callback URL'leri

### Google OAuth

1. https://console.cloud.google.com/apis/credentials adresine gidin
2. OAuth 2.0 Client ID'nizi seçin
3. **Authorized redirect URIs** bölümüne ekleyin:
   ```
   https://www.hirenup.com/api/auth/callback/google
   ```
4. **Authorized JavaScript origins** bölümüne ekleyin:
   ```
   https://www.hirenup.com
   https://www.hirenup.com
   ```

### Facebook OAuth

1. https://developers.facebook.com/apps/ adresine gidin
2. Uygulamanızı seçin
3. **Settings > Basic** bölümüne gidin
4. **App Domains** bölümüne ekleyin:
   ```
   www.hirenup.com
   hirenup.com
   ```
5. **Settings > Facebook Login > Settings** bölümüne gidin
6. **Valid OAuth Redirect URIs** bölümüne ekleyin:
   ```
   https://www.hirenup.com/api/auth/callback/facebook
   ```

## 🚀 Deployment Adımları

### Vercel (Önerilen)

1. **GitHub'a Push Edin**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Vercel'e Import Edin**
   - https://vercel.com adresine gidin
   - "Import Project" tıklayın
   - GitHub repository'nizi seçin

3. **Environment Variables Ekleyin**
   - Project Settings > Environment Variables
   - `.env.example` dosyasındaki tüm değişkenleri ekleyin
   - `NEXTAUTH_URL` için: `https://www.hirenup.com`

4. **Domain Ekleyin**
   - Project Settings > Domains
   - `www.hirenup.com` ekleyin
   - DNS kayıtlarını güncelleyin

5. **Deploy Edin**
   - Vercel otomatik olarak deploy edecektir

### Railway

1. **Railway'a Bağlayın**
   - https://railway.app adresine gidin
   - "New Project" > "Deploy from GitHub repo"
   - Repository'nizi seçin

2. **PostgreSQL Ekle**
   - "New" > "Database" > "Add PostgreSQL"
   - Connection string'i kopyalayın

3. **Environment Variables Ekleyin**
   - Variables sekmesine gidin
   - Tüm environment variable'ları ekleyin

4. **Custom Domain Ekleyin**
   - Settings > Networking
   - "Custom Domain" ekleyin
   - `www.hirenup.com` girin
   - DNS kayıtlarını güncelleyin

### Render

1. **Render'a Bağlayın**
   - https://render.com adresine gidin
   - "New" > "Web Service"
   - GitHub repository'nizi bağlayın

2. **Environment Variables Ekleyin**
   - Environment sekmesine gidin
   - Tüm değişkenleri ekleyin

3. **Custom Domain Ekleyin**
   - Settings > Custom Domains
   - `www.hirenup.com` ekleyin
   - DNS kayıtlarını güncelleyin

## ✅ Deployment Sonrası Kontroller

1. **SSL Sertifikası**: `https://www.hirenup.com` çalışıyor mu?
2. **OAuth Girişleri**: Google ve Facebook ile giriş yapılabiliyor mu?
3. **API Endpoints**: `/api/auth/callback/google` ve `/api/auth/callback/facebook` çalışıyor mu?
4. **Database Bağlantısı**: Veritabanı bağlantısı çalışıyor mu?
5. **Environment Variables**: Tüm değişkenler doğru ayarlanmış mı?

## 🔍 Troubleshooting

### OAuth Callback Hatası

- OAuth provider'larınızda callback URL'lerin doğru olduğundan emin olun
- `NEXTAUTH_URL` environment variable'ının `https://www.hirenup.com` olduğunu kontrol edin

### Domain Yönlendirme Hatası

- DNS kayıtlarının doğru olduğundan emin olun
- DNS değişikliklerinin yayılması 24-48 saat sürebilir

### SSL Sertifikası Hatası

- Modern hosting servisleri otomatik SSL sağlar
- Domain'inizi bağladıktan sonra birkaç dakika bekleyin

## 📝 Önemli Notlar

- Production'da `NEXTAUTH_URL` mutlaka `https://www.hirenup.com` olmalı
- OAuth callback URL'leri production domain'ine göre ayarlanmalı
- Environment variable'lar production ortamında güvenli bir şekilde saklanmalı
- Database connection string production veritabanını işaret etmeli

## 🎉 Başarılı!

Domain'iniz başarıyla yapılandırıldıysa, `https://www.hirenup.com` adresinden sitenize erişebilirsiniz!

