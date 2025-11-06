# 📦 Git Repository - Hızlı Başlangıç

## 🔍 Mevcut Durum

Git repository başlatılmış ama **yanlış yerde** (kullanıcı klasöründe). Proje klasöründe düzgün başlatmamız gerekiyor.

## ⚡ Hızlı Çözüm

### Yöntem 1: Batch Dosyası ile (En Kolay)

1. **`GIT-BASLAT.bat` dosyasına çift tıklayın**
2. Otomatik olarak:
   - Git repository başlatılacak
   - Dosyalar eklenecek
   - Commit yapılacak
   - Branch main yapılacak

### Yöntem 2: Manuel Komutlar

Proje klasöründe terminal açın ve şu komutları sırayla çalıştırın:

```bash
# 1. Proje klasörüne git
cd "C:\Users\aliba\OneDrive\Masaüstü\Cursor"

# 2. Git repository başlat (eğer yoksa)
git init

# 3. Tüm dosyaları ekle
git add .

# 4. İlk commit yap
git commit -m "Initial commit - HireNUp project"

# 5. Branch'i main yap
git branch -M main
```

---

## 📤 GitHub'a Push Etme

### 1. GitHub Repository Oluşturun

1. **GitHub'a gidin:** https://github.com
2. **Yeni repository:**
   - Sağ üstte "+" > "New repository"
   - Repository name: `hirenup`
   - Public veya Private seçin
   - **"Initialize with README" işaretlemeyin**
   - "Create repository" tıklayın

### 2. GitHub'a Bağlayın

Proje klasöründe terminal açın:

```bash
# GitHub repository URL'inizi ekleyin
git remote add origin https://github.com/KULLANICIADI/hirenup.git

# GitHub'a push et
git push -u origin main
```

**Not:** 
- `KULLANICIADI` → GitHub kullanıcı adınız
- `hirenup` → Repository adınız

---

## 🔐 GitHub Kimlik Doğrulama

Push ederken kimlik doğrulama gerekir:

### Seçenek 1: Personal Access Token (Önerilen)

1. **GitHub > Settings > Developer settings > Personal access tokens**
2. **"Generate new token (classic)" tıklayın**
3. **Token ayarları:**
   - Note: `HireNUp Project`
   - Expiration: `90 days` (veya istediğiniz süre)
   - Scopes: `repo` işaretleyin
4. **"Generate token" tıklayın**
5. **Token'ı kopyalayın** (bir daha gösterilmeyecek!)
6. **Push ederken şifre yerine token kullanın**

### Seçenek 2: GitHub Desktop

- GitHub Desktop uygulamasını kullanabilirsiniz
- Daha kolay kimlik doğrulama

---

## ✅ Kontrol Listesi

- [ ] Git repository başlatıldı (`git init`)
- [ ] Dosyalar eklendi (`git add .`)
- [ ] Commit yapıldı (`git commit`)
- [ ] Branch main yapıldı (`git branch -M main`)
- [ ] GitHub repository oluşturuldu
- [ ] Remote eklendi (`git remote add origin`)
- [ ] GitHub'a push edildi (`git push`)

---

## 🎯 Git Dosyası Nerede?

Git repository bilgileri **`.git`** klasöründe saklanır. Bu klasör:

- **Konum:** `C:\Users\aliba\OneDrive\Masaüstü\Cursor\.git`
- **Görünürlük:** Gizli klasör (Windows'ta gizli dosyaları gösterirseniz görürsünüz)
- **İçerik:** Git repository'nin tüm geçmişi ve ayarları

**Önemli:** `.git` klasörünü **asla silmeyin!** Bu klasörü silerseniz tüm Git geçmişiniz kaybolur.

---

## 🚀 Sonraki Adım

GitHub'a push ettikten sonra:
1. Vercel'e gidin
2. "Import Git Repository" seçin
3. Repository'nizi seçin
4. Deploy edin

Detaylar için `VERCEL-KURULUM.md` dosyasına bakın.

