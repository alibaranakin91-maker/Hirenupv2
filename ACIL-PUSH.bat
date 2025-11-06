@echo off
chcp 65001 >nul
echo ========================================
echo ACIL: GitHub'a Push
echo ========================================
echo.

cd /d "%~dp0"

echo Mevcut dizin: %CD%
echo.

echo Git durumunu kontrol ediliyor...
git status
echo.

echo Dosyalar ekleniyor...
git add .
echo.

echo Commit yapiliyor...
git commit -m "Fix: Add missing EmployerProfile model and fix Prisma schema"
echo.

echo GitHub'a push ediliyor...
git push
echo.

echo ========================================
echo Push tamamlandi!
echo ========================================
echo.
echo Simdi Vercel'de yeni deployment'i bekleyin.
echo Yeni commit hash'i farkli olacak.
echo.
pause

