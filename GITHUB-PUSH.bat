@echo off
chcp 65001 >nul
echo ========================================
echo GitHub'a Push Etme
echo ========================================
echo.

cd /d "%~dp0"

echo Mevcut dizin: %CD%
echo.

echo [1/4] Git durumunu kontrol ediliyor...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo HATA: Git repository bulunamadi!
    echo Lutfen once GIT-BASLAT.bat dosyasini calistirin.
    pause
    exit /b 1
)
echo Git repository mevcut.
echo.

echo [2/4] Remote kontrol ediliyor...
git remote -v >nul 2>&1
if %errorlevel% equ 0 (
    echo Mevcut remote'lar:
    git remote -v
    echo.
    set /p REMOVE="Mevcut remote'u kaldirmak istiyor musunuz? (E/H): "
    if /i "%REMOVE%"=="E" (
        git remote remove origin
        echo Remote kaldirildi.
    )
)
echo.

echo [3/4] GitHub Repository URL'i ekleniyor...
echo.
echo GitHub repository URL'inizi girin:
echo Ornek: https://github.com/kullaniciadi/hirenup.git
echo.
set /p GITHUB_URL="GitHub URL: "

if "%GITHUB_URL%"=="" (
    echo HATA: URL bos olamaz!
    pause
    exit /b 1
)

REM URL'deki son / karakterini kaldır
set GITHUB_URL=%GITHUB_URL:/=%
set GITHUB_URL=%GITHUB_URL: =%

git remote add origin %GITHUB_URL%
if %errorlevel% neq 0 (
    echo HATA: Remote eklenemedi!
    pause
    exit /b 1
)
echo Remote basariyla eklendi.
echo.

echo [4/4] GitHub'a push ediliyor...
echo.
echo NOT: GitHub kimlik dogrulamasi gerekebilir.
echo Eger sifre sorarsa, Personal Access Token kullanin.
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo BASARILI! GitHub'a push edildi!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo HATA: Push basarisiz oldu!
    echo ========================================
    echo.
    echo Olası nedenler:
    echo 1. GitHub repository henuz olusturulmamis
    echo 2. Repository adi yanlis
    echo 3. Kimlik dogrulama hatasi
    echo.
    echo Cozum:
    echo 1. GitHub'da repository olusturun: https://github.com/new
    echo 2. Repository adini kontrol edin
    echo 3. Personal Access Token kullanin
    echo.
)

pause

