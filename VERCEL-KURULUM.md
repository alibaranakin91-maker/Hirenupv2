# 🚀 Vercel'e Deploy - Mevcut Domain ile

Zaten Vercel hesabınız ve domain'iniz varsa, bu adımları takip edin.

## 📋 Adım Adım Kurulum

### 1️⃣ Projeyi GitHub'a Yükleyin

**GitHub Repository Oluşturun:**

1. **GitHub'a gidin:** https://github.com
2. **Yeni repository oluşturun:**
   - Sağ üstte "+" > "New repository"
   - Repository name: `hirenup` (veya istediğiniz isim)
   - Public veya Private seçin
   - "Create repository" tıklayın

**Projeyi GitHub'a Push Edin:**

Proje klasöründe terminal açın ve şu komutları çalıştırın:

```bash
# Git başlat (eğer başlatılmadıysa)
git init

# Tüm dosyaları ekle
git add .

# Commit yap
git commit -m "Initial commit - HireNUp project"

# GitHub repository URL'ini ekle (kendi repository URL'inizi kullanın)
git remote add origin https://github.com/KULLANICIADI/hirenup.git

# Branch'i main yap
git branch -M main

# GitHub'a push et
git push -u origin main
```

**Not:** `KULLANICIADI` ve `hirenup` kısmını kendi GitHub kullanıcı adınız ve repository adınızla değiştirin.

---

### 2️⃣ Vercel'e Projeyi Import Edin

1. **Vercel'e gidin:** https://vercel.com
2. **Giriş yapın** (zaten üyeliğiniz var)
3. **Dashboard'da "Add New..." > "Project" tıklayın**
4. **"Import Git Repository" seçin**
5. **GitHub repository'nizi seçin**
   - Repository listesinde `hirenup` (veya oluşturduğunuz isim) görünecek
   - "Import" butonuna tıklayın

---

### 3️⃣ Proje Ayarlarını Yapın

**Framework Preset:**
- Vercel otomatik olarak Next.js'i algılayacak
- "Framework Preset: Next.js" görünecek

**Root Directory:**
- Boş bırakın (proje root'ta)

**Build Command:**
- Vercel otomatik olarak `next build` komutunu kullanacak

**Output Directory:**
- Boş bırakın (Next.js otomatik ayarlar)

---

### 4️⃣ Environment Variables Ekleyin

**"Environment Variables" bölümüne gidin ve şunları ekleyin:**

#### 1. NEXTAUTH_URL
```
NEXTAUTH_URL = https://www.hirenup.com
```

#### 2. NEXTAUTH_SECRET
- https://generate-secret.vercel.app/32 adresine gidin
- Oluşturulan secret key'i kopyalayın
- Vercel'e ekleyin:
```
NEXTAUTH_SECRET = (oluşturduğunuz 32 karakterlik secret)
```

#### 3. DATABASE_URL
- Supabase hesabı oluşturun: https://supabase.com
- Yeni proje oluşturun
- Settings > Database > Connection string kopyalayın
- Vercel'e ekleyin:
```
DATABASE_URL = postgresql://postgres:[ŞİFRE]@db.[PROJE-ID].supabase.co:5432/postgres
```

**Not:** `[ŞİFRE]` ve `[PROJE-ID]` kısmını Supabase'den aldığınız değerlerle değiştirin.

#### 4. Google OAuth (Opsiyonel - Şimdilik boş bırakabilirsiniz)
```
GOOGLE_CLIENT_ID = 
GOOGLE_CLIENT_SECRET = 
```

#### 5. Facebook OAuth (Opsiyonel - Şimdilik boş bırakabilirsiniz)
```
FACEBOOK_CLIENT_ID = 
FACEBOOK_CLIENT_SECRET = 
```

**Environment Variables Eklerken:**
- Her birini tek tek ekleyin
- "Value" kısmına değeri yapıştırın
- "Add" butonuna tıklayın
- Production, Preview, Development için işaretleyin (genellikle hepsini seçin)

---

### 5️⃣ Domain'i Bağlayın

**Vercel'de Domain Ayarları:**

1. **Proje deploy edildikten sonra:**
   - Proje sayfasında "Settings" > "Domains" sekmesine gidin
   - Veya üst menüden "Domains" > Projenizi seçin

2. **Domain ekleyin:**
   - "Add Domain" veya "Add" butonuna tıklayın
   - `www.hirenup.com` yazın
   - "Add" tıklayın

3. **DNS Ayarları:**
   - Vercel size DNS kayıtlarını gösterecek
   - Eğer domain zaten Vercel'deyse, otomatik olarak bağlanacak
   - Eğer başka bir yerdeyse, DNS kayıtlarını güncellemeniz gerekecek

**Domain Zaten Vercel'deyse:**
- Domain otomatik olarak projeye bağlanacak
- Birkaç dakika içinde aktif olacak

**Domain Başka Bir Yerdeyse:**
- Domain kontrol panelinizde DNS kayıtlarını güncelleyin:
  - CNAME: `www` → Vercel'in verdiği CNAME
  - Veya A Record: `@` → Vercel'in verdiği IP

---

### 6️⃣ Deploy Edin

1. **"Deploy" butonuna tıklayın**
2. **Vercel otomatik olarak:**
   - Dependencies yükleyecek (`npm install`)
   - Projeyi build edecek (`next build`)
   - Deploy edecek

3. **Build sırasında:**
   - Prisma client generate edilecek
   - Veritabanı şeması push edilecek (eğer `postinstall` script'i eklendiyse)

**Build İşlemi:**
- İlk build 2-5 dakika sürebilir
- Sonraki build'ler daha hızlı olacak

---

### 7️⃣ Veritabanını Hazırlayın

**Prisma Migrate:**

Deploy sonrası veritabanı şemasını oluşturmanız gerekiyor:

**Seçenek A: Vercel CLI ile (Önerilen)**

```bash
# Vercel CLI yükle (eğer yoksa)
npm install -g vercel

# Vercel'e giriş yap
vercel login

# Proje klasöründe
vercel link

# Veritabanı migrate
vercel env pull .env.local
npx prisma db push
```

**Seçenek B: Manuel (Supabase Studio)**

1. Supabase Dashboard'a gidin
2. SQL Editor'ü açın
3. `prisma/schema.prisma` dosyasındaki şemayı manuel olarak oluşturun

**Seçenek C: Build Script Ekle**

`package.json` dosyasına şunu ekleyin:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && prisma db push && next build"
  }
}
```

---

### 8️⃣ Test Edin

1. **Siteyi Açın:**
   - `https://www.hirenup.com` adresine gidin
   - Site açılıyor mu kontrol edin

2. **OAuth Test (Eğer eklediyseniz):**
   - Google ile giriş yapmayı deneyin
   - Facebook ile giriş yapmayı deneyin

3. **Veritabanı Test:**
   - Dashboard'a giriş yapın
   - Veritabanı bağlantısını test edin

---

## ✅ Tamamlandı!

Artık siteniz `https://www.hirenup.com` adresinden erişilebilir olmalı!

---

## 🔧 Sorun Giderme

### Build Hatası

**Hata: "Module not found"**
- Vercel'de "Settings" > "General" > "Install Command" kontrol edin
- `npm install` olmalı

**Hata: "Prisma Client not found"**
- `package.json`'a `postinstall` script ekleyin:
  ```json
  "postinstall": "prisma generate"
  ```

### Domain Bağlantı Hatası

**Domain bağlanmıyor:**
- Vercel'de "Settings" > "Domains" kontrol edin
- DNS kayıtlarının doğru olduğundan emin olun
- DNS yayılması için 1-2 saat bekleyin

### Environment Variables Hatası

**OAuth çalışmıyor:**
- Environment variables'ın doğru eklendiğinden emin olun
- OAuth provider ayarlarında callback URL'lerin doğru olduğunu kontrol edin

---

## 📝 Sonraki Adımlar

1. **Google OAuth ekleyin:** `DOMAIN-KURULUM.md` dosyasındaki Google OAuth bölümünü okuyun
2. **Facebook OAuth ekleyin:** `DOMAIN-KURULUM.md` dosyasındaki Facebook OAuth bölümünü okuyun
3. **Veritabanı verilerini kontrol edin:** Supabase Studio'da tabloları kontrol edin

---

## 🎉 Başarılı!

Projeniz artık canlıda! Herhangi bir sorunla karşılaşırsanız, hata mesajlarını paylaşın.

