# ⚡ Hızlı Kurulum - www.hirenup.com

En hızlı şekilde domain'inizi bağlamak için bu adımları takip edin.

## 🚀 5 Dakikada Domain Bağlama (Vercel ile)

### Adım 1: GitHub'a Yükleyin (2 dakika)

```bash
# Proje klasöründe terminal açın
git init
git add .
git commit -m "Deploy to production"
git remote add origin https://github.com/KULLANICIADI/hirenup.git
git push -u origin main
```

**Not:** GitHub hesabınız yoksa: https://github.com adresinden ücretsiz hesap oluşturun.

---

### Adım 2: Vercel'e Deploy Edin (2 dakika)

1. **Vercel'e gidin:** https://vercel.com
2. **GitHub ile giriş yapın**
3. **"New Project" tıklayın**
4. **Repository'nizi seçin**
5. **"Import" tıklayın**

---

### Adım 3: Environment Variables Ekleyin (1 dakika)

Vercel proje ayarlarında "Environment Variables" sekmesine gidin:

**1. NEXTAUTH_SECRET Oluşturun:**
- https://generate-secret.vercel.app/32 adresine gidin
- Oluşturulan key'i kopyalayın

**2. Environment Variables Ekleyin:**

Vercel'de şu değişkenleri ekleyin:

| Key | Value |
|-----|-------|
| `NEXTAUTH_URL` | `https://www.hirenup.com` |
| `NEXTAUTH_SECRET` | (32 karakterlik secret - yukarıdan oluşturun) |
| `DATABASE_URL` | (Supabase'den alacağınız - aşağıda) |
| `GOOGLE_CLIENT_ID` | (Şimdilik boş bırakabilirsiniz) |
| `GOOGLE_CLIENT_SECRET` | (Şimdilik boş bırakabilirsiniz) |
| `FACEBOOK_CLIENT_ID` | (Şimdilik boş bırakabilirsiniz) |
| `FACEBOOK_CLIENT_SECRET` | (Şimdilik boş bırakabilirsiniz) |

**3. Supabase Veritabanı Oluşturun:**
- https://supabase.com → "Start your project"
- Yeni proje oluşturun
- Settings > Database > Connection string kopyalayın
- `DATABASE_URL` olarak Vercel'e ekleyin

**4. Deploy Edin:**
- "Deploy" butonuna tıklayın
- Birkaç dakika bekleyin

---

### Adım 4: Domain Ekleyin (1 dakika)

1. **Vercel'de Domain Ekleyin:**
   - Proje ayarları > "Domains"
   - "Add Domain" tıklayın
   - `www.hirenup.com` yazın
   - "Add" tıklayın

2. **DNS Kayıtlarını Güncelleyin:**
   - Vercel size DNS kayıtlarını gösterecek
   - Domain sağlayıcınızın kontrol panelinde (Namecheap, GoDaddy vb.):
     - **CNAME** kaydı ekleyin:
       - Type: `CNAME`
       - Name: `www`
       - Value: Vercel'in verdiği CNAME (örn: `cname.vercel-dns.com`)

3. **Bekleyin:**
   - DNS yayılması 1-2 saat sürebilir
   - SSL sertifikası otomatik olarak aktif olacak

---

## ✅ Tamamlandı!

Birkaç saat sonra `https://www.hirenup.com` adresinden sitenize erişebilirsiniz!

**OAuth ayarlarını sonra yapabilirsiniz** - site şimdilik çalışacaktır.

---

## 📝 Sonraki Adımlar (Opsiyonel)

OAuth (Google/Facebook giriş) için:
1. `DOMAIN-KURULUM.md` dosyasındaki "Google OAuth Ayarları" bölümünü okuyun
2. `DOMAIN-KURULUM.md` dosyasındaki "Facebook OAuth Ayarları" bölümünü okuyun

