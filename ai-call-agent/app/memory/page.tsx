"use client";

import { useEffect, useState } from "react";
import { Brain, Plus, Trash2, BookOpen } from "lucide-react";

interface MemoryItem {
  id: string;
  category: string;
  key: string;
  content: string;
  priority: number;
  isActive: boolean;
}

const categoryLabels: Record<string, string> = {
  firma: "Firma Bilgileri",
  urun: "Ürün/Hizmet Bilgileri",
  fiyat: "Fiyatlandırma",
  sss: "Sık Sorulan Sorular",
  itiraz: "İtiraz Yanıtları",
  senaryo: "Konuşma Senaryoları",
  genel: "Genel Bilgiler",
};

const categoryColors: Record<string, string> = {
  firma: "bg-blue-50 text-blue-700 border-blue-200",
  urun: "bg-green-50 text-green-700 border-green-200",
  fiyat: "bg-purple-50 text-purple-700 border-purple-200",
  sss: "bg-orange-50 text-orange-700 border-orange-200",
  itiraz: "bg-red-50 text-red-700 border-red-200",
  senaryo: "bg-yellow-50 text-yellow-700 border-yellow-200",
  genel: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function MemoryPage() {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    category: "genel",
    key: "",
    content: "",
    priority: 0,
  });

  const fetchMemories = () => {
    fetch("/api/memory")
      .then((r) => r.json())
      .then((d) => {
        setMemories(d.data || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMemory),
    });
    setNewMemory({ category: "genel", key: "", content: "", priority: 0 });
    setShowAddForm(false);
    fetchMemories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu hafıza öğesini silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/memory?id=${id}`, { method: "DELETE" });
    fetchMemories();
  };

  const grouped = memories.reduce(
    (acc, m) => {
      if (!acc[m.category]) acc[m.category] = [];
      acc[m.category].push(m);
      return acc;
    },
    {} as Record<string, MemoryItem[]>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hafıza</h1>
          <p className="text-gray-500 text-sm mt-1">
            AI ajanın bilgi tabanı ve hafızası
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Hafıza Ekle
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-brand-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-brand-900">
              Hafıza Sistemi Nasıl Çalışır?
            </p>
            <p className="text-sm text-brand-700 mt-1">
              Buraya eklediğiniz bilgiler, AI ajanın müşterilerle konuşurken
              kullanacağı bilgi tabanını oluşturur. Firma bilgileri, ürün
              detayları, fiyatlar, sık sorulan sorulara cevaplar ve itiraz
              yanıtları ekleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-6"
        >
          <h3 className="font-semibold mb-4">Yeni Hafıza Öğesi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={newMemory.category}
              onChange={(e) =>
                setNewMemory({ ...newMemory, category: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {Object.entries(categoryLabels).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
            <input
              placeholder="Anahtar (örn: 'Çalışma Saatleri') *"
              value={newMemory.key}
              onChange={(e) =>
                setNewMemory({ ...newMemory, key: e.target.value })
              }
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="İçerik (örn: 'Pazartesi-Cuma 09:00-18:00 arası hizmet veriyoruz') *"
              value={newMemory.content}
              onChange={(e) =>
                setNewMemory({ ...newMemory, content: e.target.value })
              }
              required
              rows={3}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:col-span-2"
            />
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Öncelik (yüksek = daha önemli)
              </label>
              <input
                type="number"
                value={newMemory.priority}
                onChange={(e) =>
                  setNewMemory({
                    ...newMemory,
                    priority: parseInt(e.target.value) || 0,
                  })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-700"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {/* Memory Items */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Henüz hafıza öğesi eklenmemiş</p>
          <p className="text-sm text-gray-400 mt-1">
            AI ajanınızın bilgi tabanını oluşturmaya başlayın
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                {categoryLabels[category] || category}
                <span className="text-xs text-gray-400 font-normal">
                  ({items.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-4 ${categoryColors[category] || "bg-white border-gray-200"}`}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium">{item.key}</h3>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 hover:bg-white/50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5 opacity-50" />
                      </button>
                    </div>
                    <p className="text-sm mt-1 opacity-80">{item.content}</p>
                    {item.priority > 0 && (
                      <span className="text-xs opacity-60 mt-2 inline-block">
                        Öncelik: {item.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
