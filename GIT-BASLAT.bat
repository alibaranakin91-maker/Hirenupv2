@echo off
chcp 65001 >nul
echo ========================================
echo Git Repository Baslatma
echo ========================================
echo.

cd /d "%~dp0"

echo Mevcut dizin: %CD%
echo.

echo [1/5] Git durumunu kontrol ediliyor...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo Git repository bulunamadi. Baslatiliyor...
    git init
    echo Git repository baslatildi.
) else (
    echo Git repository zaten mevcut.
)
echo.

echo [2/5] Dosyalar ekleniyor...
git add .
echo Dosyalar eklendi.
echo.

echo [3/5] Commit yapiliyor...
git commit -m "Initial commit - HireNUp project"
if %errorlevel% neq 0 (
    echo UYARI: Commit yapilamadi. Dosyalar zaten commit edilmis olabilir.
) else (
    echo Commit basarili.
)
echo.

echo [4/5] Branch main yapiliyor...
git branch -M main
echo Branch main olarak ayarlandi.
echo.

echo ========================================
echo Git Repository Hazir!
echo ========================================
echo.
echo Simdi GitHub'a push etmek icin:
echo 1. GitHub'da yeni repository olusturun
echo 2. Asagidaki komutlari calistirin:
echo.
echo    git remote add origin https://github.com/KULLANICIADI/hirenup.git
echo    git push -u origin main
echo.
echo NOT: KULLANICIADI ve hirenup kismini kendi bilgilerinizle degistirin.
echo.
pause

