# ✅ Environment Dosyası Hazır!

`.env.local` dosyası oluşturuldu. Şimdi yapman gerekenler:

## 🔑 Önemli: Şifreyi Değiştir!

`.env.local` dosyasını aç ve `[2.MuhittinSupabase]` kısmını Supabase şifresi ile değiştir.

Supabase şifreni bulmak için:
1. https://supabase.com adresine git
2. Projeni seç
3. Settings > Database > Database password bölümüne bak
4. Veya proje oluştururken kaydettiğin şifreyi kullan

## 📝 Örnek:

```env
# ÖNCE (Yanlış):
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.gyecknemhospwvhsicds.supabase.co:5432/postgres"

# SONRA (Doğru - şifreni yaz):
DATABASE_URL="postgresql://postgres:2.MuhittinSupabase@db.gyecknemhospwvhsicds.supabase.co:5432/postgres"
```

## 🚀 Sonraki Adımlar:

1. **Şifreyi değiştir** (yukarıdaki gibi)
2. **Bağımlılıkları yükle:**
   ```bash
   npm install
   ```

3. **Veritabanını oluştur:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Sunucuyu başlat:**
   ```bash
   npm run dev
   ```

5. **Tarayıcıda aç:** http://localhost:3000

---

## ⚠️ Notlar:

- `.env.local` dosyası asla GitHub'a push edilmemeli (güvenlik için)
- Şifre Supabase proje ayarlarından bulunabilir
- Eğer şifreyi unuttuysan, Supabase'de reset edebilirsin

---

## ✅ Hazırsın!

Şifreyi değiştirdikten sonra yukarıdaki komutları çalıştır ve projen çalışacak! 🎉

