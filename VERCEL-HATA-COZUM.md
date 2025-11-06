# 🔧 Vercel "npm install" Hatası - Çözüm

## ❌ Hata Mesajı

```
Command "npm install" exited with 1
```

## 🔍 Olası Nedenler

1. **Prisma generate hatası**
2. **Node.js versiyonu uyumsuzluğu**
3. **Dependency çakışması**
4. **package-lock.json sorunu**

## ✅ Çözümler

### Çözüm 1: Vercel Build Ayarları (En Yaygın)

Vercel'de proje ayarlarını güncelleyin:

1. **Vercel Dashboard** > Projeniz > **Settings**
2. **General** sekmesine gidin
3. **Build & Development Settings** bölümünde:

**Build Command:**
```
npm run build
```

**Install Command:**
```
npm install
```

**Output Directory:**
```
.next
```

**Node.js Version:**
```
18.x
```
veya
```
20.x
```

### Çözüm 2: package.json Script'lerini Kontrol Edin

`package.json` dosyanızda şu script'ler olmalı:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

### Çözüm 3: .npmrc Dosyası Oluşturun

Proje root'unda `.npmrc` dosyası oluşturun:

```
engine-strict=false
legacy-peer-deps=true
```

### Çözüm 4: Vercel Environment Variables

Vercel'de **Environment Variables** ekleyin:

```
SKIP_ENV_VALIDATION=true
```

### Çözüm 5: package-lock.json'u Güncelleyin

Yerel olarak:

```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

---

## 🚀 Hızlı Çözüm

### Adım 1: Vercel Build Ayarlarını Güncelleyin

1. Vercel Dashboard > Projeniz > **Settings**
2. **General** > **Build & Development Settings**
3. **Override** butonuna tıklayın
4. Şunları ayarlayın:

**Build Command:**
```
npm run build
```

**Install Command:**
```
npm install --legacy-peer-deps
```

**Node.js Version:**
```
20.x
```

### Adım 2: Environment Variable Ekleyin

**Settings** > **Environment Variables**:

```
SKIP_ENV_VALIDATION = true
```

### Adım 3: Yeniden Deploy Edin

1. **Deployments** sekmesine gidin
2. Son deployment'ın yanında **"..."** > **"Redeploy"**
3. Veya yeni bir commit push edin

---

## 🔍 Detaylı Hata Logları

Vercel'de deployment loglarını kontrol edin:

1. **Deployments** sekmesine gidin
2. Başarısız deployment'a tıklayın
3. **Build Logs** sekmesine gidin
4. Hata mesajını okuyun

Yaygın hatalar:

### "prisma: command not found"
**Çözüm:** `postinstall` script'i ekleyin:
```json
"postinstall": "prisma generate"
```

### "Cannot find module"
**Çözüm:** `package-lock.json`'u güncelleyin ve push edin

### "Peer dependency conflict"
**Çözüm:** Install command'e `--legacy-peer-deps` ekleyin

---

## 📋 Kontrol Listesi

- [ ] Vercel Build Command doğru mu?
- [ ] Install Command doğru mu?
- [ ] Node.js versiyonu uyumlu mu? (18.x veya 20.x)
- [ ] `postinstall` script'i var mı?
- [ ] `package-lock.json` commit edilmiş mi?
- [ ] Environment variables eklenmiş mi?

---

## 🎯 Önerilen Vercel Ayarları

**Build Command:**
```
npm run build
```

**Install Command:**
```
npm install
```

**Output Directory:**
```
.next
```

**Node.js Version:**
```
20.x
```

**Environment Variables:**
```
SKIP_ENV_VALIDATION=true
NODE_ENV=production
```

---

## ❓ Hala Sorun mu Var?

Hata loglarını paylaşın, daha spesifik çözüm sunabilirim.

