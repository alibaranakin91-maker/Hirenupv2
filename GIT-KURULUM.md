# 📦 Git Repository Kurulumu

Projenizde Git repository'si başlatılmış ama henüz commit yapılmamış. İşte adım adım ne yapmanız gerekiyor:

## 🔍 Mevcut Durum

Git repository başlatılmış ama:
- ✅ `.git` klasörü mevcut
- ❌ Henüz commit yapılmamış
- ❌ GitHub'a push edilmemiş

## 📝 Adım Adım Git Kurulumu

### 1️⃣ Git Repository'yi Kontrol Edin

Proje klasöründe terminal açın ve şu komutu çalıştırın:

```bash
git status
```

Eğer "fatal: not a git repository" hatası alırsanız, Git'i başlatmanız gerekir:

```bash
git init
```

### 2️⃣ Dosyaları Git'e Ekleyin

```bash
# Tüm dosyaları staging area'ya ekle
git add .

# Veya belirli dosyaları ekleyin
git add .
```

### 3️⃣ İlk Commit'i Yapın

```bash
git commit -m "Initial commit - HireNUp project"
```

### 4️⃣ GitHub Repository Oluşturun

1. **GitHub'a gidin:** https://github.com
2. **Yeni repository oluşturun:**
   - Sağ üstte "+" > "New repository"
   - Repository name: `hirenup` (veya istediğiniz isim)
   - Public veya Private seçin
   - **"Initialize this repository with a README" işaretlemeyin** (zaten dosyalarınız var)
   - "Create repository" tıklayın

### 5️⃣ GitHub'a Bağlayın ve Push Edin

GitHub repository oluşturduktan sonra, size verilen komutları çalıştırın:

```bash
# GitHub repository URL'inizi ekleyin (kendi URL'inizi kullanın)
git remote add origin https://github.com/KULLANICIADI/hirenup.git

# Branch'i main yap
git branch -M main

# GitHub'a push et
git push -u origin main
```

**Not:** `KULLANICIADI` ve `hirenup` kısmını kendi GitHub bilgilerinizle değiştirin.

---

## 🚀 Hızlı Komutlar (Tek Seferde)

Proje klasöründe terminal açın ve şu komutları sırayla çalıştırın:

```bash
# 1. Git durumunu kontrol et
git status

# 2. Tüm dosyaları ekle
git add .

# 3. Commit yap
git commit -m "Initial commit - HireNUp project"

# 4. GitHub repository URL'ini ekle (kendi URL'inizi kullanın)
git remote add origin https://github.com/KULLANICIADI/hirenup.git

# 5. Branch'i main yap
git branch -M main

# 6. GitHub'a push et
git push -u origin main
```

---

## ⚠️ Önemli Notlar

### .gitignore Dosyası

Projenizde `.gitignore` dosyası mevcut ve şunları ignore ediyor:
- `node_modules/` - NPM paketleri
- `.env*.local` - Environment dosyaları
- `.next/` - Next.js build dosyaları
- `.vercel/` - Vercel dosyaları

Bu dosyalar GitHub'a yüklenmeyecek (doğru).

### Environment Dosyaları

`.env.local` dosyanızı **asla** GitHub'a push etmeyin! Bu dosya `.gitignore`'da zaten var.

### İlk Push Sonrası

GitHub'a push ettikten sonra:
1. Vercel'e gidin
2. "Import Git Repository" seçin
3. Repository'nizi seçin
4. Deploy edin

---

## 🔧 Sorun Giderme

### "fatal: not a git repository" Hatası

```bash
git init
```

### "remote origin already exists" Hatası

```bash
# Mevcut remote'u kaldır
git remote remove origin

# Yeni remote ekle
git remote add origin https://github.com/KULLANICIADI/hirenup.git
```

### "Permission denied" Hatası

GitHub'a push ederken kimlik doğrulama gerekir:
- Personal Access Token kullanın
- Veya SSH key kullanın

**Personal Access Token:**
1. GitHub > Settings > Developer settings > Personal access tokens
2. "Generate new token" tıklayın
3. "repo" yetkisini seçin
4. Token'ı kopyalayın
5. Push ederken şifre yerine token kullanın

---

## ✅ Kontrol Listesi

- [ ] Git repository başlatıldı (`git init`)
- [ ] Dosyalar eklendi (`git add .`)
- [ ] İlk commit yapıldı (`git commit`)
- [ ] GitHub repository oluşturuldu
- [ ] Remote eklendi (`git remote add origin`)
- [ ] GitHub'a push edildi (`git push`)

---

## 🎉 Tamamlandı!

GitHub'a push ettikten sonra, Vercel'e gidip projeyi import edebilirsiniz!

