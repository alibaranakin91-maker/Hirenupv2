@echo off
chcp 65001 >nul
echo ========================================
echo Git Commit ve Push
echo ========================================
echo.

cd /d "%~dp0"

echo Mevcut dizin: %CD%
echo.

echo [1/4] Git durumunu kontrol ediliyor...
git status
echo.

echo [2/4] Dosyalar ekleniyor...
git add .
echo Dosyalar eklendi.
echo.

echo [3/4] Commit yapiliyor...
git commit -m "Initial commit - HireNUp project"
if %errorlevel% neq 0 (
    echo UYARI: Commit yapilamadi veya zaten commit edilmis.
) else (
    echo Commit basarili.
)
echo.

echo [4/4] GitHub'a push ediliyor...
echo.
echo ========================================
echo ONEMLI: GitHub Kimlik Dogrulamasi
echo ========================================
echo.
echo Push ederken kimlik dogrulamasi gerekebilir:
echo - Username: alibaranakin91-maker
echo - Password: Personal Access Token kullanin (sifre degil!)
echo.
echo Devam etmek icin bir tusa basin...
pause
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo BASARILI! GitHub'a push edildi!
    echo ========================================
    echo.
    echo Repository URL: https://github.com/alibaranakin91-maker/Hirenupv2
    echo.
    echo Dosyalarinizi kontrol edin!
) else (
    echo.
    echo ========================================
    echo HATA: Push basarisiz oldu!
    echo ========================================
    echo.
    echo Olası nedenler:
    echo 1. Kimlik dogrulama hatasi
    echo 2. Personal Access Token gerekli
    echo.
)

pause

