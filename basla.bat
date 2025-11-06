@echo off
echo ====================================
echo   Hirenup Projesi Baslatiliyor...
echo ====================================
echo.

echo [1/4] Bagimliliklari kontrol ediliyor...
if not exist node_modules (
    echo Node modules bulunamadi, yukleniyor...
    call npm install
) else (
    echo Node modules mevcut.
)
echo.

echo [2/4] .env.local dosyasi kontrol ediliyor...
if not exist .env.local (
    echo.
    echo UYARI: .env.local dosyasi bulunamadi!
    echo Lutfen .env.local dosyasi olusturun ve gerekli bilgileri ekleyin.
    echo BASLA.md dosyasina bakin.
    echo.
    pause
    exit /b 1
) else (
    echo .env.local dosyasi mevcut.
)
echo.

echo [3/4] Prisma client kontrol ediliyor...
call npm run db:generate
echo.

echo [4/4] Veritabani kontrol ediliyor...
call npm run db:push
echo.

echo ====================================
echo   Sunucu baslatiliyor...
echo   Tarayicida http://localhost:3000 adresini acin
echo ====================================
echo.

call npm run dev

pause

