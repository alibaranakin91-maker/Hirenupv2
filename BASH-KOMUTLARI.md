# 🐚 Git Bash / Bash Kullanıcıları İçin Komutlar

## 📁 Doğru Klasöre Git

Git Bash'te Windows yolu için şunu kullan:

```bash
cd /c/Users/aliba/OneDrive/Masaüstü/Cursor
```

veya Windows yolunu dönüştür:

```bash
cd "C:/Users/aliba/OneDrive/Masaüstü/Cursor"
```

## ✅ Kontrol Et

```bash
pwd
ls -la
```

`package.json` dosyasını görmeli.

## 🚀 Komutları Çalıştır

```bash
# 1. Prisma client oluştur
npx prisma generate

# 2. Veritabanı tablolarını oluştur
npx prisma db push

# 3. Sunucuyu başlat
npm run dev
```

veya

```bash
npx next dev
```

---

## 💡 Alternatif: Windows PowerShell Kullan

Eğer Git Bash sorun çıkarıyorsa, Windows PowerShell kullan:

1. Windows tuşu + R
2. `powershell` yaz ve Enter
3. Şu komutu çalıştır:
   ```powershell
   cd "C:\Users\aliba\OneDrive\Masaüstü\Cursor"
   ```

