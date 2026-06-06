"use client";

import { useState } from "react";
import { Plug, Copy, Check, Code, Globe } from "lucide-react";

export default function IntegrationPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3001";

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const embedCode = `<!-- AI Call Agent - Tek Tıkla CRM Entegrasyonu -->
<script src="${appUrl}/api/crm/embed"></script>
<script>
  // API anahtarınızı ayarlayın
  AICallAgent._apiKey = 'YOUR_API_KEY_HERE';
</script>`;

  const apiExamples = {
    call: `// Kişiyi Ara
fetch('${appUrl}/api/crm', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    action: 'call',
    contactId: 'CONTACT_ID'
  })
});`,
    addNote: `// Not Ekle
fetch('${appUrl}/api/crm', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    action: 'add-note',
    contactId: 'CONTACT_ID',
    content: 'Müşteri demo istedi',
    type: 'FOLLOW_UP'
  })
});`,
    addContact: `// Kişi Ekle
fetch('${appUrl}/api/crm', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    action: 'add-contact',
    name: 'Ahmet Yılmaz',
    phone: '+905551234567',
    company: 'ABC Şirketi',
    email: 'ahmet@abc.com'
  })
});`,
    webhook: `// Webhook Kaydet
fetch('${appUrl}/api/crm', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    action: 'register-webhook',
    url: 'https://your-crm.com/webhook',
    events: ['call.completed', 'contact.updated', 'note.created'],
    secret: 'your-webhook-secret'
  })
});`,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">CRM Entegrasyonu</h1>
        <p className="text-gray-500 text-sm mt-1">
          Tek tıkla kendi CRM yazılımınıza entegre edin
        </p>
      </div>

      {/* Embed Code */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-50 rounded-lg">
            <Code className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              Tek Tıkla Entegrasyon
            </h2>
            <p className="text-sm text-gray-500">
              Bu kodu CRM yazılımınızın HTML sayfasına ekleyin
            </p>
          </div>
        </div>
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto">
            {embedCode}
          </pre>
          <button
            onClick={() => copyToClipboard(embedCode, "embed")}
            className="absolute top-3 right-3 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {copied === "embed" ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Usage After Embed */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">
          Entegrasyon Sonrası Kullanım
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 mb-2">
            Script yüklendikten sonra <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">window.AICallAgent</code> objesi üzerinden tüm işlemleri yapabilirsiniz:
          </p>
          <pre className="text-sm text-gray-600 mt-2">
{`// Kişiyi ara
AICallAgent.call('contactId');

// Not ekle
AICallAgent.addNote('contactId', 'Müşteri ilgileniyor', 'FOLLOW_UP');

// Durum güncelle
AICallAgent.updateStatus('contactId', 'INTERESTED');

// Widget aç
AICallAgent.openWidget('contactId');

// İstatistikler
AICallAgent.getStats().then(console.log);`}
          </pre>
        </div>
      </div>

      {/* API Examples */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-50 rounded-lg">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">REST API</h2>
            <p className="text-sm text-gray-500">
              Doğrudan API ile entegrasyon
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(apiExamples).map(([key, code]) => (
            <div key={key} className="relative">
              <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-xs overflow-x-auto">
                {code}
              </pre>
              <button
                onClick={() => copyToClipboard(code, key)}
                className="absolute top-3 right-3 p-1.5 bg-gray-800 rounded hover:bg-gray-700"
              >
                {copied === key ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
