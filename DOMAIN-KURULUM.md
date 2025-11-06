# 🌐 Domain Kurulum Rehberi - www.hirenup.com

Bu rehber, sitenizi `www.hirenup.com` domain'ine bağlamak için gerekli tüm adımları içerir.

## 📋 Adım Adım Kurulum

### 1️⃣ Hosting Servisi Seçin ve Projeyi Deploy Edin

#### Seçenek A: Vercel (En Kolay - Önerilen) ⭐

**1. Vercel Hesabı Oluşturun:**
- https://vercel.com adresine gidin
- "Sign Up" tıklayın
- GitHub hesabınızla giriş yapın (önerilen)

**2. Projeyi GitHub'a Yükleyin:**
```bash
# Proje klasöründe terminal açın
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/kullaniciadi/hirenup.git
git push -u origin main
```

**3. Vercel'e Projeyi Ekleyin:**
- Vercel dashboard'da "New Project" tıklayın
- GitHub repository'nizi seçin
- "Import" tıklayın

**4. Environment Variables Ekleyin:**
Vercel proje ayarlarında "Environment Variables" sekmesine gidin ve şunları ekleyin:

```
NEXTAUTH_URL = https://www.hirenup.com
NEXTAUTH_SECRET = (https://generate-secret.vercel.app/32 adresinden oluşturun)
DATABASE_URL = (Supabase veya diğer veritabanı bağlantı string'iniz)
GOOGLE_CLIENT_ID = (Google OAuth'tan alacağınız)
GOOGLE_CLIENT_SECRET = (Google OAuth'tan alacağınız)
FACEBOOK_CLIENT_ID = (Facebook OAuth'tan alacağınız)
FACEBOOK_CLIENT_SECRET = (Facebook OAuth'tan alacağınız)
```

**5. Deploy Edin:**
- "Deploy" butonuna tıklayın
- Vercel otomatik olarak projenizi deploy edecek

---

#### Seçenek B: Railway

**1. Railway Hesabı Oluşturun:**
- https://railway.app adresine gidin
- GitHub ile giriş yapın

**2. Yeni Proje Oluşturun:**
- "New Project" > "Deploy from GitHub repo"
- Repository'nizi seçin

**3. PostgreSQL Ekle:**
- "New" > "Database" > "Add PostgreSQL"
- Connection string'i kopyalayın

**4. Environment Variables Ekleyin:**
- Variables sekmesine gidin
- Yukarıdaki environment variable'ları ekleyin

**5. Custom Domain Ekleyin:**
- Settings > Networking
- "Custom Domain" tıklayın
- `www.hirenup.com` yazın

---

### 2️⃣ Domain DNS Ayarları

Domain'inizi hosting servisinize yönlendirmek için DNS kayıtlarını güncellemeniz gerekir.

**Domain sağlayıcınızın kontrol panelinde (Namecheap, GoDaddy, Cloudflare vb.):**

#### Vercel için DNS Ayarları:

1. **Vercel'de Domain Ekleyin:**
   - Proje ayarları > Domains
   - "Add Domain" tıklayın
   - `www.hirenup.com` yazın
   - Vercel size DNS kayıtlarını gösterecek

2. **Domain Kontrol Panelinde DNS Kayıtlarını Güncelleyin:**
   
   **CNAME Kaydı:**
   - Type: `CNAME`
   - Name/Host: `www`
   - Value/Points to: Vercel'in verdiği CNAME (örn: `cname.vercel-dns.com`)
   - TTL: `3600` veya `Automatic`

   **A Kaydı (Root domain için - opsiyonel):**
   - Type: `A`
   - Name/Host: `@` veya boş
   - Value/Points to: Vercel'in verdiği IP adresi
   - TTL: `3600` veya `Automatic`

#### Railway için DNS Ayarları:

1. **Railway'de Custom Domain Ekleyin:**
   - Settings > Networking > Custom Domain
   - Domain'i ekleyin

2. **DNS Kayıtlarını Güncelleyin:**
   - Railway size DNS kayıtlarını gösterecek
   - Bu kayıtları domain kontrol panelinize ekleyin

**Önemli:** DNS değişikliklerinin yayılması 24-48 saat sürebilir. Genellikle 1-2 saat içinde aktif olur.

---

### 3️⃣ Google OAuth Ayarları

**1. Google Cloud Console'a Gidin:**
- https://console.cloud.google.com/ adresine gidin
- Giriş yapın

**2. Yeni Proje Oluşturun:**
- Üst menüden "Select a project" > "New Project"
- Proje adı: `HireNUp`
- "Create" tıklayın

**3. OAuth Consent Screen Ayarlayın:**
- Sol menüden "APIs & Services" > "OAuth consent screen"
- User Type: "External" seçin
- "Create" tıklayın
- Şunları doldurun:
  - App name: `HireNUp`
  - User support email: (Email adresiniz)
  - Developer contact information: (Email adresiniz)
- "Save and Continue" tıklayın
- Scopes: "Save and Continue" (varsayılan ayarlar yeterli)
- Test users: "Save and Continue" (şimdilik atlayabilirsiniz)
- "Back to Dashboard" tıklayın

**4. OAuth Credentials Oluşturun:**
- Sol menüden "APIs & Services" > "Credentials"
- "Create Credentials" > "OAuth client ID"
- Application type: "Web application"
- Name: `HireNUp Web Client`
- Authorized JavaScript origins:
  ```
  https://www.hirenup.com
  ```
- Authorized redirect URIs:
  ```
  https://www.hirenup.com/api/auth/callback/google
  ```
- "Create" tıklayın
- **Client ID** ve **Client Secret**'ı kopyalayın

**5. Environment Variables'a Ekleyin:**
- Hosting servisinizde (Vercel/Railway) environment variables'a ekleyin:
  ```
  GOOGLE_CLIENT_ID = (kopyaladığınız Client ID)
  GOOGLE_CLIENT_SECRET = (kopyaladığınız Client Secret)
  ```

---

### 4️⃣ Facebook OAuth Ayarları

**1. Facebook Developers'a Gidin:**
- https://developers.facebook.com/ adresine gidin
- Giriş yapın

**2. Yeni Uygulama Oluşturun:**
- "My Apps" > "Create App"
- App type: "Consumer" seçin
- App name: `HireNUp`
- Contact email: (Email adresiniz)
- "Create App" tıklayın

**3. Facebook Login Ekleyin:**
- Sol menüden "Add Product"
- "Facebook Login" > "Set Up"
- "Settings" altında şunları ayarlayın:

**4. OAuth Redirect URIs:**
- Valid OAuth Redirect URIs:
  ```
  https://www.hirenup.com/api/auth/callback/facebook
  ```

**5. App Domains:**
- Settings > Basic
- App Domains:
  ```
  www.hirenup.com
  hirenup.com
  ```

**6. Site URL:**
- Settings > Basic
- Site URL:
  ```
  https://www.hirenup.com
  ```

**7. App ID ve App Secret:**
- Settings > Basic
- **App ID** ve **App Secret**'ı kopyalayın
- App Secret'ı görmek için "Show" butonuna tıklayın

**8. Environment Variables'a Ekleyin:**
- Hosting servisinizde environment variables'a ekleyin:
  ```
  FACEBOOK_CLIENT_ID = (kopyaladığınız App ID)
  FACEBOOK_CLIENT_SECRET = (kopyaladığınız App Secret)
  ```

---

### 5️⃣ Veritabanı Ayarları

**Supabase (Önerilen - Ücretsiz):**

1. **Supabase Hesabı Oluşturun:**
   - https://supabase.com adresine gidin
   - "Start your project" tıklayın
   - GitHub ile giriş yapın

2. **Yeni Proje Oluşturun:**
   - "New Project" tıklayın
   - Project name: `hirenup`
   - Database password: (Güçlü bir şifre seçin)
   - Region: Size en yakın bölgeyi seçin
   - "Create new project" tıklayın

3. **Connection String Alın:**
   - Settings > Database
   - "Connection string" bölümüne gidin
   - "URI" sekmesini seçin
   - Connection string'i kopyalayın
   - Şifre kısmını kendi şifrenizle değiştirin

4. **Environment Variables'a Ekleyin:**
   ```
   DATABASE_URL = (Supabase'den aldığınız connection string)
   ```

5. **Prisma Migrate Çalıştırın:**
   - Hosting servisinizde build sırasında otomatik çalışır
   - Veya manuel olarak:
   ```bash
   npx prisma db push
   ```

---

### 6️⃣ NEXTAUTH_SECRET Oluşturun

**1. Secret Key Oluşturun:**
- https://generate-secret.vercel.app/32 adresine gidin
- Veya terminal'de:
  ```bash
  openssl rand -base64 32
  ```
- Oluşturulan secret key'i kopyalayın

**2. Environment Variables'a Ekleyin:**
```
NEXTAUTH_SECRET = (oluşturduğunuz secret key)
```

---

### 7️⃣ Son Kontroller ve Test

**1. Tüm Environment Variables Kontrol Edin:**
- ✅ `NEXTAUTH_URL` = `https://www.hirenup.com`
- ✅ `NEXTAUTH_SECRET` = (32 karakterlik secret)
- ✅ `DATABASE_URL` = (Veritabanı bağlantı string'i)
- ✅ `GOOGLE_CLIENT_ID` = (Google'dan aldığınız)
- ✅ `GOOGLE_CLIENT_SECRET` = (Google'dan aldığınız)
- ✅ `FACEBOOK_CLIENT_ID` = (Facebook'tan aldığınız)
- ✅ `FACEBOOK_CLIENT_SECRET` = (Facebook'tan aldığınız)

**2. DNS Yayılmasını Kontrol Edin:**
- https://dnschecker.org adresine gidin
- Domain: `www.hirenup.com`
- DNS kayıtlarının dünya genelinde yayıldığını kontrol edin

**3. SSL Sertifikası:**
- Vercel ve Railway otomatik SSL sağlar
- Birkaç dakika içinde `https://www.hirenup.com` aktif olur

**4. Siteyi Test Edin:**
- `https://www.hirenup.com` adresine gidin
- Google ile giriş yapmayı deneyin
- Facebook ile giriş yapmayı deneyin
- Her şey çalışıyorsa başarılı! 🎉

---

## ❓ Sık Sorulan Sorular

**Q: DNS değişiklikleri ne kadar sürede aktif olur?**
A: Genellikle 1-2 saat, bazen 24-48 saat sürebilir.

**Q: SSL sertifikası otomatik mi?**
A: Evet, Vercel ve Railway otomatik SSL sağlar.

**Q: OAuth callback hatası alıyorum, ne yapmalıyım?**
A: OAuth provider ayarlarınızda callback URL'lerin doğru olduğundan emin olun. `NEXTAUTH_URL` environment variable'ının da doğru olduğunu kontrol edin.

**Q: Veritabanı bağlantı hatası alıyorum?**
A: `DATABASE_URL` environment variable'ının doğru olduğunu ve veritabanı servisinizin çalıştığını kontrol edin.

---

## 🎉 Başarılı!

Tüm adımları tamamladıysanız, siteniz `https://www.hirenup.com` adresinden erişilebilir olmalı!

Herhangi bir sorunla karşılaşırsanız, hata mesajlarını paylaşın ve size yardımcı olayım.

