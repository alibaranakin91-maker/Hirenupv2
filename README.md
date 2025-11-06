# Hirenup - All-in-One Professional Platform

Hirenup, tüm profesyonel ihtiyaçlarınız için tek platform. Upwork, Toptal, Odoo, LinkedIn ve Fiverr'ın birleşimi ve daha fazlası.

## 🚀 Özellikler

### 5 Hesap Türü
- **Freelancer**: Bağımsız çalışın, puanlanın, rozet kazanın
- **Girişimci**: Girişim başlatın, ekip kurun, yatırım alın
- **İşçi**: Görevlerinizi tamamlayın, raporlayın
- **İşveren**: İş ilanları açın, çalışanları yönetin
- **Yatırımcı**: Yatırım yapın, raporları inceleyin

### Şirket Özellikleri
- 4 Üyelik Planı: Silver, Gold, Platinum, Prime
- Prime planında özelleştirilebilir özellikler
- Şirket yönetimi ve yetki sistemi
- Çalışan yönetimi ve rozetleme

### Freelancer Özellikleri
- Komisyon sistemi
- VetTek doğrulama
- Puanlama ve rozet sistemi
- Çalışma saati takibi
- İş ilanlarına başvuru

### Reklam Sistemi
- Facebook benzeri reklam yönetim paneli
- Detaylı raporlama ve analitik
- Kampanya yönetimi
- Hedef kitle belirleme

### Diğer Özellikler
- API entegrasyonları (Mikro, YouTube, Facebook, Instagram, Twitter, LinkedIn)
- Görev yönetimi ve raporlama
- Yatırım platformu
- Rozet ve puanlama sistemi
- Google ve Facebook ile giriş

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14+, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS (Turkuaz-Mavi tema)

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL
- npm veya yarn

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment değişkenlerini ayarlayın:
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin ve gerekli bilgileri girin:
- `DATABASE_URL`: PostgreSQL bağlantı string'i
- `NEXTAUTH_SECRET`: NextAuth için secret key
- `NEXTAUTH_URL`: Uygulama URL'i
- `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET`: Google OAuth bilgileri
- `FACEBOOK_CLIENT_ID` ve `FACEBOOK_CLIENT_SECRET`: Facebook OAuth bilgileri

3. Veritabanını oluşturun:
```bash
npx prisma generate
npx prisma db push
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 📁 Proje Yapısı

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication sayfaları
│   ├── dashboard/         # Dashboard sayfaları
│   └── page.tsx           # Ana sayfa
├── components/            # React bileşenleri
│   └── ui/               # UI bileşenleri
├── lib/                  # Yardımcı fonksiyonlar
├── prisma/               # Prisma şeması
└── types/                # TypeScript tipleri
```

## 🎨 Renk Paleti

Platform, turkuaz ve mavi tonlarında modern bir tasarıma sahiptir:
- **Primary**: Deep Blue (#0284c7)
- **Turquoise**: Cyan (#22d3ee)
- **Accent**: Turquoise (#22d3ee)

## 📝 Veritabanı Modelleri

- User (5 hesap türü ile)
- Company & CompanySubscription
- FreelancerProfile & Commission
- JobPosting & JobApplication
- Advertisement & AdvertisementCampaign
- Task & Report
- Integration & Permission
- Badge & Rating
- Ve daha fazlası...

## 🔐 Güvenlik

- NextAuth.js ile güvenli kimlik doğrulama
- OAuth2 desteği (Google, Facebook)
- Rol tabanlı yetkilendirme
- API erişim kontrolü

## 📄 Lisans

Bu proje özel bir projedir.

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen pull request göndermeden önce issue açın.

## 📞 İletişim

Sorularınız için lütfen iletişime geçin.

