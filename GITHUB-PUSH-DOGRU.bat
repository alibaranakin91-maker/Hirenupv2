@echo off
chcp 65001 >nul
echo ========================================
echo GitHub'a Push Etme - Dogru URL
echo ========================================
echo.

cd /d "%~dp0"

echo Mevcut dizin: %CD%
echo.

echo [1/5] Git durumunu kontrol ediliyor...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo HATA: Git repository bulunamadi!
    echo Lutfen once GIT-BASLAT.bat dosyasini calistirin.
    pause
    exit /b 1
)
echo Git repository mevcut.
echo.

echo [2/5] Mevcut remote kontrol ediliyor...
git remote -v
echo.

set /p REMOVE="Mevcut remote'u kaldirmak istiyor musunuz? (E/H): "
if /i "%REMOVE%"=="E" (
    git remote remove origin
    echo Remote kaldirildi.
    echo.
)

echo [3/5] Dogru GitHub URL'i ekleniyor...
echo URL: https://github.com/alibaranakin91-maker/Hirenupv2.git
echo.

git remote add origin https://github.com/alibaranakin91-maker/Hirenupv2.git
if %errorlevel% neq 0 (
    echo UYARI: Remote zaten mevcut olabilir. Devam ediliyor...
) else (
    echo Remote basariyla eklendi.
)
echo.

echo [4/5] Remote URL'i kontrol ediliyor...
git remote -v
echo.

echo [5/5] GitHub'a push ediliyor...
echo.
echo ========================================
echo ONEMLI: GitHub Kimlik Dogrulamasi
echo ========================================
echo.
echo Push ederken kimlik dogrulamasi gerekebilir:
echo - Username: alibaranakin91-maker
echo - Password: Personal Access Token kullanin (sifre degil!)
echo.
echo Personal Access Token olusturmak icin:
echo https://github.com/settings/tokens
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
    echo Cozum:
    echo 1. GitHub'da Personal Access Token olusturun
    echo 2. Push ederken sifre yerine token kullanin
    echo.
    echo Token olusturma: https://github.com/settings/tokens
    echo.
)

pause

