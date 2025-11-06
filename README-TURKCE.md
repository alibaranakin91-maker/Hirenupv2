# 🚀 Hirenup - Projeyi Canlıya Alma

## ⚡ Hızlı Başlangıç (3 Adım)

### 1. Bağımlılıkları Yükle
```bash
npm install
```

### 2. Environment Dosyası Oluştur
`.env.local` dosyası oluştur ve şu içeriği ekle:

```env
DATABASE_URL="postgresql://user:password@host:5432/hirenup?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="rastgele-gizli-anahtar-buraya"
```

**Veritabanı için:**
- **Supabase** (Ücretsiz): https://supabase.com → Yeni proje → Settings > Database → Connection string kopyala
- **Veya** yerel PostgreSQL kurabilirsin

**NEXTAUTH_SECRET için:**
- https://generate-secret.vercel.app/32 adresinden oluştur

### 3. Veritabanını Oluştur ve Başlat
```bash
npm run db:generate
npm run db:push
npm run dev
```

🎉 **Tarayıcıda aç:** http://localhost:3000

---

## 📖 Detaylı Rehber

- **Türkçe:** `BASLA.md` dosyasına bak
- **İngilizce:** `README.md` dosyasına bak
- **Kurulum:** `KURULUM.md` dosyasına bak

---

## 🛠️ Windows Kullanıcıları İçin

`basla.bat` dosyasına çift tıkla veya terminal'de:
```bash
basla.bat
```

---

## ❓ Sorun mu var?

### Port 3000 kullanılıyor?
```bash
PORT=3001 npm run dev
```

### Veritabanı hatası?
- `.env.local` dosyasındaki `DATABASE_URL`'i kontrol et
- Veritabanı bağlantısının çalıştığından emin ol

### Prisma hatası?
```bash
npm run db:generate
npm run db:push
```

---

## 📝 Önemli Notlar

- İlk çalıştırmada `npm install` komutu 2-5 dakika sürebilir
- Veritabanı bağlantısı için internet gereklidir (Supabase kullanıyorsan)
- OAuth (Google/Facebook) ayarları opsiyoneldir, şimdilik boş bırakabilirsin

---

## ✅ Başarılı!

Projen çalışıyorsa, ana sayfayı göreceksin. Herhangi bir sorun olursa hata mesajını paylaş!

