"use client";

import { useEffect, useState } from "react";
import { Bot, Plus, Save, Trash2 } from "lucide-react";

interface AgentConfig {
  id: string;
  name: string;
  personality: string | null;
  greeting: string | null;
  objective: string | null;
  instructions: string | null;
  voiceId: string | null;
  language: string;
  maxCallDuration: number;
  isActive: boolean;
  _count: { calls: number };
}

export default function SettingsPage() {
  const [configs, setConfigs] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    personality: "",
    greeting: "",
    objective: "",
    instructions: "",
    voiceId: "alloy",
    language: "tr-TR",
    maxCallDuration: 300,
  });

  const fetchConfigs = () => {
    fetch("/api/agent-config")
      .then((r) => r.json())
      .then((d) => {
        setConfigs(d.data || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/agent-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({
      name: "",
      personality: "",
      greeting: "",
      objective: "",
      instructions: "",
      voiceId: "alloy",
      language: "tr-TR",
      maxCallDuration: 300,
    });
    fetchConfigs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Ayarları</h1>
          <p className="text-gray-500 text-sm mt-1">
            AI ajanın kişiliğini ve davranışını yapılandırın
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Yeni Yapılandırma
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-6"
        >
          <h3 className="font-semibold mb-4">Yeni Agent Yapılandırması</h3>
          <div className="space-y-4">
            <input
              placeholder="Yapılandırma Adı *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Kişilik (örn: 'Samimi, profesyonel, çözüm odaklı bir satış temsilcisi...')"
              value={form.personality}
              onChange={(e) =>
                setForm({ ...form, personality: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Karşılama Metni (örn: 'Merhaba {{name}}, ben ABC Şirketinden arıyorum...')"
              value={form.greeting}
              onChange={(e) => setForm({ ...form, greeting: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Amaç (örn: 'Müşteriye ürünümüzü tanıtmak ve demo randevusu almak')"
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Özel Talimatlar (örn: 'Fiyat sorulduğunda önce değer önerisini anlat...')"
              value={form.instructions}
              onChange={(e) =>
                setForm({ ...form, instructions: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Ses</label>
                <select
                  value={form.voiceId}
                  onChange={(e) =>
                    setForm({ ...form, voiceId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="alloy">Alloy</option>
                  <option value="echo">Echo</option>
                  <option value="fable">Fable</option>
                  <option value="onyx">Onyx</option>
                  <option value="nova">Nova</option>
                  <option value="shimmer">Shimmer</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Dil</label>
                <select
                  value={form.language}
                  onChange={(e) =>
                    setForm({ ...form, language: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="tr-TR">Türkçe</option>
                  <option value="en-US">English</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Max Süre (sn)
                </label>
                <input
                  type="number"
                  value={form.maxCallDuration}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      maxCallDuration: parseInt(e.target.value) || 300,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-700"
            >
              <Save className="w-4 h-4" />
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
      ) : configs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Henüz yapılandırma oluşturulmamış</p>
        </div>
      ) : (
        <div className="space-y-4">
          {configs.map((config) => (
            <div
              key={config.id}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-brand-600" />
                  <h3 className="font-semibold text-gray-900">{config.name}</h3>
                  {config.isActive && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                      Aktif
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {config._count.calls} arama
                </span>
              </div>
              {config.personality && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Kişilik:</span>{" "}
                  {config.personality}
                </p>
              )}
              {config.objective && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Amaç:</span>{" "}
                  {config.objective}
                </p>
              )}
              {config.greeting && (
                <p className="text-sm text-gray-500 italic">
                  &ldquo;{config.greeting}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
