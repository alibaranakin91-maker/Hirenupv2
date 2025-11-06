@echo off
chcp 65001 >nul
echo ========================================
echo Son Degisiklikleri GitHub'a Push Etme
echo ========================================
echo.

cd /d "%~dp0"

echo Mevcut dizin: %CD%
echo.

echo [1/3] Git durumunu kontrol ediliyor...
git status
echo.

echo [2/3] Dosyalar ekleniyor ve commit yapiliyor...
git add .
git commit -m "Fix: Add missing EmployerProfile model and fix Prisma schema"
echo.

echo [3/3] GitHub'a push ediliyor...
git push
echo.

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo BASARILI! GitHub'a push edildi!
    echo ========================================
    echo.
    echo Vercel otomatik olarak yeni deployment baslatacak.
    echo.
) else (
    echo.
    echo ========================================
    echo HATA: Push basarisiz oldu!
    echo ========================================
    echo.
)

pause

