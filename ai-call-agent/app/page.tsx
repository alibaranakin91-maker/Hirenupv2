"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Phone,
  FileText,
  Brain,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface DashboardStats {
  totalContacts: number;
  totalCalls: number;
  totalNotes: number;
  totalMemories: number;
  agentConfigs: number;
  contactsByStatus: Record<string, number>;
  callsByStatus: Record<string, number>;
  recentCalls: Array<{
    id: string;
    status: string;
    outcome: string | null;
    summary: string | null;
    createdAt: string;
    contact: { name: string; phone: string };
  }>;
  services: { openai: boolean; twilio: boolean; database: boolean };
}

const statusLabels: Record<string, string> = {
  NEW: "Yeni",
  CONTACTED: "İletişime Geçildi",
  INTERESTED: "İlgileniyor",
  NOT_INTERESTED: "İlgilenmiyor",
  APPOINTMENT_SET: "Randevu Alındı",
  FOLLOW_UP: "Takip",
  SALE_CLOSED: "Satış Kapatıldı",
  LOST: "Kayıp",
};

const callStatusLabels: Record<string, string> = {
  COMPLETED: "Tamamlandı",
  IN_PROGRESS: "Devam Ediyor",
  QUEUED: "Sırada",
  FAILED: "Başarısız",
  NO_ANSWER: "Cevapsız",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-red-500">Veriler yüklenemedi</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">AI Call Agent genel bakış</p>
      </div>

      {/* Service Status */}
      <div className="mb-6 flex gap-3">
        {Object.entries(stats.services).map(([name, active]) => (
          <div
            key={name}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              active
                ? "bg-green-50 text-green-700"
                : "bg-yellow-50 text-yellow-700"
            }`}
          >
            {active ? (
              <CheckCircle className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            {name === "openai"
              ? "OpenAI"
              : name === "twilio"
                ? "Twilio"
                : "Veritabanı"}
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Toplam Kişi"
          value={stats.totalContacts}
          color="blue"
        />
        <StatCard
          icon={<Phone className="w-5 h-5" />}
          label="Toplam Arama"
          value={stats.totalCalls}
          color="green"
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="CRM Notları"
          value={stats.totalNotes}
          color="purple"
        />
        <StatCard
          icon={<Brain className="w-5 h-5" />}
          label="Hafıza Öğeleri"
          value={stats.totalMemories}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Kişi Durumları
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.contactsByStatus).map(
              ([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {statusLabels[status] || status}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-brand-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (count / Math.max(stats.totalContacts, 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              )
            )}
            {Object.keys(stats.contactsByStatus).length === 0 && (
              <p className="text-sm text-gray-400">Henüz kişi yok</p>
            )}
          </div>
        </div>

        {/* Recent Calls */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Son Aramalar</h2>
          <div className="space-y-3">
            {stats.recentCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {call.contact.name}
                  </p>
                  <p className="text-xs text-gray-400">{call.contact.phone}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      call.status === "COMPLETED"
                        ? "bg-green-50 text-green-700"
                        : call.status === "FAILED"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {callStatusLabels[call.status] || call.status}
                  </span>
                </div>
              </div>
            ))}
            {stats.recentCalls.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                Henüz arama yapılmadı
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
