# 🚨 Sorun: npm run dev çalışmıyor

## ✅ Çözüm Adımları

### 1. Terminal'de doğru klasörde olduğundan emin ol

Terminal'de şu komutu çalıştır ve `package.json` dosyasının olduğunu kontrol et:

```bash
dir
```

veya

```bash
ls
```

Eğer `package.json` dosyasını görmüyorsan, proje klasörüne git:

```bash
cd C:\Users\aliba\OneDrive\Masaüstü\Cursor
```

### 2. Bağımlılıkları yükle

```bash
npm install
```

⏱️ Bu işlem 2-5 dakika sürebilir. Tüm paketler yüklenecek.

### 3. Devam et

Bağımlılıklar yüklendikten sonra:

```bash
# Prisma client oluştur
npm run db:generate

# Veritabanı tablolarını oluştur
npm run db:push

# Sunucuyu başlat
npm run dev
```

---

## ❓ Hala çalışmıyor mu?

### Kontrol Listesi:

- [ ] `package.json` dosyası var mı?
- [ ] `node_modules` klasörü var mı? (npm install'dan sonra oluşur)
- [ ] Terminal'de doğru klasörde misin?
- [ ] Node.js yüklü mü? (`node --version`)

### Hata mesajı alıyorsan:

Hata mesajını paylaş, yardımcı olayım.

