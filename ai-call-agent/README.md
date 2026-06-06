# AI Call Agent - Akıllı Arama Asistanı

CRM entegrasyonlu yapay zeka telefon arama asistanı. Müşterilerinizi otomatik olarak arar, doğal konuşmalar yapar ve CRM notları oluşturur.

## Özellikler

- **İnsan Gibi Konuşma**: GPT-4 destekli doğal dil işleme ile müşteriler fark etmez
- **Hafıza Sistemi**: Ürün bilgileri, fiyatlar, SSS ve itiraz yanıtları ile eğitilebilir
- **Otomatik CRM Notları**: Görüşme sonrası otomatik özet, duygu analizi ve CRM adım güncellemesi
- **Twilio Entegrasyonu**: Gerçek telefon aramaları yapabilme
- **Tek Tıkla CRM Entegrasyonu**: Mevcut CRM yazılımınıza script ile entegre edin
- **Webhook Desteği**: Arama tamamlandığında, not eklendiğinde CRM'inize bildirim
- **Dashboard**: Tüm aramaları, kişileri ve istatistikleri görüntüleyin

## Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL
- OpenAI API anahtarı (opsiyonel - olmadan simülasyon modu çalışır)
- Twilio hesabı (opsiyonel - olmadan simülasyon modu çalışır)

### Adımlar

```bash
# Bağımlılıkları yükleyin
npm install

# Veritabanını oluşturun
npx prisma db push

# Örnek verileri yükleyin
npm run db:seed

# Geliştirme sunucusunu başlatın
npm run dev
```

Dashboard: http://localhost:3001

### Ortam Değişkenleri

`.env` dosyasını düzenleyin:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_call_agent"
OPENAI_API_KEY="sk-..."       # Opsiyonel
TWILIO_ACCOUNT_SID="AC..."    # Opsiyonel
TWILIO_AUTH_TOKEN="..."        # Opsiyonel
TWILIO_PHONE_NUMBER="+1..."   # Opsiyonel
CRM_API_KEY="your-api-key"
```

## CRM Entegrasyonu

### Tek Tıkla Embed

CRM yazılımınızın HTML sayfasına ekleyin:

```html
<script src="http://localhost:3001/api/crm/embed"></script>
<script>
  AICallAgent._apiKey = 'your-api-key';

  // Kişiyi ara
  AICallAgent.call('contactId');

  // Not ekle
  AICallAgent.addNote('contactId', 'Müşteri ilgileniyor');

  // Durum güncelle
  AICallAgent.updateStatus('contactId', 'INTERESTED');
</script>
```

### REST API

```bash
# İstatistikler
curl -H "X-API-Key: your-key" http://localhost:3001/api/crm?action=stats

# Kişi ekle
curl -X POST -H "X-API-Key: your-key" -H "Content-Type: application/json" \
  http://localhost:3001/api/crm \
  -d '{"action":"add-contact","name":"Test","phone":"+905551234567"}'

# Arama başlat
curl -X POST -H "X-API-Key: your-key" -H "Content-Type: application/json" \
  http://localhost:3001/api/crm \
  -d '{"action":"call","contactId":"CONTACT_ID"}'
```

## Mimari

```
ai-call-agent/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── calls/         # Arama yönetimi
│   │   ├── contacts/      # Kişi yönetimi
│   │   ├── memory/        # Hafıza yönetimi
│   │   ├── crm/           # CRM entegrasyon API
│   │   └── webhooks/      # Twilio webhooks
│   ├── contacts/          # Kişiler sayfası
│   ├── calls/             # Aramalar sayfası
│   ├── memory/            # Hafıza sayfası
│   ├── settings/          # Agent ayarları
│   └── integration/       # Entegrasyon rehberi
├── lib/                   # Core servisler
│   ├── ai-conversation.ts # AI konuşma motoru
│   ├── call-engine.ts     # Arama motoru
│   ├── memory-manager.ts  # Hafıza yönetimi
│   └── crm-service.ts     # CRM servisi
└── prisma/                # Veritabanı şeması
```

## Teknolojiler

- **Next.js 14** - Frontend + API
- **OpenAI GPT-4** - AI konuşma
- **Twilio** - Telefon aramaları
- **Prisma + PostgreSQL** - Veritabanı
- **Tailwind CSS** - UI
