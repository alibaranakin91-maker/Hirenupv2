"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Phone,
  Search,
  Upload,
  Trash2,
  User,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  title: string | null;
  status: string;
  tags: string[];
  notes: string | null;
  lastCalledAt: string | null;
  _count: { calls: number; crmNotes: number };
}

const statusColors: Record<string, string> = {
  NEW: "bg-gray-100 text-gray-700",
  CONTACTED: "bg-blue-50 text-blue-700",
  INTERESTED: "bg-green-50 text-green-700",
  NOT_INTERESTED: "bg-red-50 text-red-700",
  APPOINTMENT_SET: "bg-purple-50 text-purple-700",
  FOLLOW_UP: "bg-yellow-50 text-yellow-700",
  SALE_CLOSED: "bg-emerald-50 text-emerald-700",
  LOST: "bg-gray-50 text-gray-500",
};

const statusLabels: Record<string, string> = {
  NEW: "Yeni",
  CONTACTED: "İletişime Geçildi",
  INTERESTED: "İlgileniyor",
  NOT_INTERESTED: "İlgilenmiyor",
  APPOINTMENT_SET: "Randevu",
  FOLLOW_UP: "Takip",
  SALE_CLOSED: "Satış Kapatıldı",
  LOST: "Kayıp",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [calling, setCalling] = useState<string | null>(null);

  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    title: "",
    notes: "",
  });

  const fetchContacts = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/contacts?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setContacts(d.data || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContacts();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContact),
    });
    setNewContact({ name: "", phone: "", email: "", company: "", title: "", notes: "" });
    setShowAddForm(false);
    fetchContacts();
  };

  const handleCall = async (contactId: string) => {
    setCalling(contactId);
    try {
      const res = await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId }),
      });
      const data = await res.json();
      alert(data.message || "Arama başlatıldı");
    } catch {
      alert("Arama başlatılamadı");
    }
    setCalling(null);
    fetchContacts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kişiyi silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    fetchContacts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kişiler</h1>
          <p className="text-gray-500 text-sm mt-1">CRM kişi listesi yönetimi</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Kişi Ekle
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-6"
        >
          <h3 className="font-semibold mb-4">Yeni Kişi Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Ad Soyad *"
              value={newContact.name}
              onChange={(e) =>
                setNewContact({ ...newContact, name: e.target.value })
              }
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Telefon *"
              value={newContact.phone}
              onChange={(e) =>
                setNewContact({ ...newContact, phone: e.target.value })
              }
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Email"
              value={newContact.email}
              onChange={(e) =>
                setNewContact({ ...newContact, email: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Şirket"
              value={newContact.company}
              onChange={(e) =>
                setNewContact({ ...newContact, company: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Unvan"
              value={newContact.title}
              onChange={(e) =>
                setNewContact({ ...newContact, title: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Notlar"
              value={newContact.notes}
              onChange={(e) =>
                setNewContact({ ...newContact, notes: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
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

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="İsim, telefon veya şirket ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </form>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Tüm Durumlar</option>
          {Object.entries(statusLabels).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Contact List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Henüz kişi eklenmemiş</p>
          <p className="text-sm text-gray-400 mt-1">
            Yukarıdaki butona tıklayarak kişi ekleyin
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">
                  Kişi
                </th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">
                  Şirket
                </th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">
                  Durum
                </th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">
                  Aramalar
                </th>
                <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-400">{c.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {c.company || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[c.status] || "bg-gray-100"}`}
                    >
                      {statusLabels[c.status] || c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {c._count.calls}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCall(c.id)}
                        disabled={calling === c.id}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                        title="Ara"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
