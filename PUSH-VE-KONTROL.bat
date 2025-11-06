@echo off
chcp 65001 >nul
echo ========================================
echo GitHub Push ve Kontrol
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Git durumunu kontrol ediliyor...
git status
echo.
pause

echo [2/4] Dosyalar ekleniyor...
git add .
echo.
pause

echo [3/4] Commit yapiliyor...
git commit -m "Fix: Add missing EmployerProfile model and fix Prisma schema"
echo.
pause

echo [4/4] GitHub'a push ediliyor...
git push
echo.

echo ========================================
echo Push tamamlandi!
echo ========================================
echo.
echo Simdi Vercel'de yeni deployment'i kontrol edin.
echo Yeni commit hash'i farkli olmali.
echo.
pause

