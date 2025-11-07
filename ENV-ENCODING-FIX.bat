@echo off
chcp 65001 >nul
echo ========================================
echo .env Dosyasi Encoding Duzenleme
echo ========================================
echo.

cd /d "%~dp0"

echo Mevcut .env dosyasini yedekleniyor...
if exist .env.backup del .env.backup
copy .env .env.backup >nul
echo.

echo Yeni .env dosyasi olusturuluyor (UTF-8 without BOM)...
(
echo # Database - Supabase PostgreSQL
echo # Sifrede nokta (.) karakteri varsa URL encode: . -^> %%2E
echo DATABASE_URL="postgresql://postgres.gyecknemhospwvhsicds:2%%2EMuhittinSupabase@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
echo.
echo # NextAuth Configuration
echo NEXTAUTH_URL="http://localhost:3000"
echo NEXTAUTH_SECRET="XhXaEPwIvQ4yCw12c3/gaJT7CdrNx2UnZ8P8sPoYgKE="
echo.
echo # Google OAuth (Opsiyonel)
echo GOOGLE_CLIENT_ID=""
echo GOOGLE_CLIENT_SECRET=""
echo.
echo # Facebook OAuth (Opsiyonel)
echo FACEBOOK_CLIENT_ID=""
echo FACEBOOK_CLIENT_SECRET=""
) > .env

echo .env dosyasi duzeltildi!
echo.
echo Test etmek icin:
echo   npx prisma db push
echo.
pause

