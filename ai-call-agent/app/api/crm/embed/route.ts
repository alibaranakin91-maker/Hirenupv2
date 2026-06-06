import { NextResponse } from "next/server";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  const embedScript = `
<!-- AI Call Agent - Tek Tıkla CRM Entegrasyonu -->
<script>
(function() {
  var AI_CALL_AGENT_URL = '${appUrl}';
  var AI_CALL_AGENT_API_KEY = 'YOUR_API_KEY_HERE';

  window.AICallAgent = {
    _apiUrl: AI_CALL_AGENT_URL,
    _apiKey: AI_CALL_AGENT_API_KEY,

    _fetch: function(method, action, data) {
      var url = this._apiUrl + '/api/crm';
      var options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this._apiKey
        }
      };
      if (method === 'GET') {
        url += '?action=' + action;
        if (data) {
          Object.keys(data).forEach(function(key) {
            url += '&' + key + '=' + encodeURIComponent(data[key]);
          });
        }
      } else {
        options.body = JSON.stringify(Object.assign({ action: action }, data));
      }
      return fetch(url, options).then(function(r) { return r.json(); });
    },

    // Kişiyi ara
    call: function(contactId, agentConfigId) {
      return this._fetch('POST', 'call', {
        contactId: contactId,
        agentConfigId: agentConfigId
      });
    },

    // Not ekle
    addNote: function(contactId, content, type) {
      return this._fetch('POST', 'add-note', {
        contactId: contactId,
        content: content,
        type: type || 'GENERAL'
      });
    },

    // Durum güncelle
    updateStatus: function(contactId, status) {
      return this._fetch('POST', 'update-status', {
        contactId: contactId,
        status: status
      });
    },

    // Kişi ekle
    addContact: function(data) {
      return this._fetch('POST', 'add-contact', data);
    },

    // İstatistikler
    getStats: function() {
      return this._fetch('GET', 'stats');
    },

    // Kişi geçmişi
    getHistory: function(contactId) {
      return this._fetch('GET', 'history', { contactId: contactId });
    },

    // Webhook kaydet
    registerWebhook: function(url, events, secret) {
      return this._fetch('POST', 'register-webhook', {
        url: url,
        events: events,
        secret: secret
      });
    },

    // Arama paneli widget'ı aç
    openWidget: function(contactId) {
      var iframe = document.getElementById('ai-call-agent-widget');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'ai-call-agent-widget';
        iframe.style.cssText = 'position:fixed;right:20px;bottom:20px;width:400px;height:600px;border:none;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.3);z-index:99999;';
        document.body.appendChild(iframe);
      }
      iframe.src = this._apiUrl + '/contacts/' + (contactId || '');
      iframe.style.display = 'block';
    },

    closeWidget: function() {
      var iframe = document.getElementById('ai-call-agent-widget');
      if (iframe) iframe.style.display = 'none';
    }
  };

  console.log('[AI Call Agent] CRM entegrasyonu yüklendi.');
})();
</script>`;

  return new NextResponse(embedScript, {
    headers: {
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
