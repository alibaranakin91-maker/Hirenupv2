# 🔧 .env Encoding Hatası - Çözüm

## ❌ Hata

```
failed to parse environment file: .env (unexpected character '»' in variable name)
```

## 🔍 Sorunun Nedeni

`.env` dosyası **UTF-8 with BOM** (Byte Order Mark) encoding ile kaydedilmiş. Supabase CLI ve birçok tool BOM'u desteklemez.

## ✅ Çözüm

### Yöntem 1: Batch Dosyası ile (En Kolay)

1. `ENV-ENCODING-FIX.bat` dosyasına çift tıklayın
2. Otomatik olarak UTF-8 without BOM ile yeniden oluşturulacak

### Yöntem 2: Manuel Düzenleme

1. **Notepad++ veya VS Code kullanın:**
   - `.env` dosyasını açın
   - **Encoding** > **Convert to UTF-8 without BOM** seçin
   - Kaydedin

2. **Veya Cursor/VS Code:**
   - Sağ altta encoding'i göreceksiniz (örn: "UTF-8 with BOM")
   - Tıklayın > "Save with Encoding" > "UTF-8" seçin

### Yöntem 3: Terminal ile

```powershell
# Dosyayı sil
Remove-Item .env -Force

# Yeni dosya oluştur (UTF-8 without BOM)
$content = @"
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.gyecknemhospwvhsicds:2%2EMuhittinSupabase@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="XhXaEPwIvQ4yCw12c3/gaJT7CdrNx2UnZ8P8sPoYgKE="

# Google OAuth (Opsiyonel)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Facebook OAuth (Opsiyonel)
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""
"@

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText("$PWD\.env", $content, $utf8NoBom)
```

## 🔍 Kontrol

Dosyanın doğru encoding ile kaydedildiğini kontrol edin:

```bash
# Supabase CLI ile test
npx supabase db diff

# Prisma ile test
npx prisma db push
```

## ✅ Başarılı!

Encoding hatası düzelmeli. Eğer hala sorun varsa, dosyayı tamamen silip yeniden oluşturun.

