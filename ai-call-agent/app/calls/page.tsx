"use client";

import { useEffect, useState } from "react";
import { Phone, Clock, MessageSquare } from "lucide-react";

interface Call {
  id: string;
  status: string;
  direction: string;
  duration: number | null;
  outcome: string | null;
  summary: string | null;
  sentiment: string | null;
  transcript: { messages?: Array<{ speaker: string; text: string; timestamp: string }> } | null;
  createdAt: string;
  contact: { name: string; phone: string; company: string | null };
}

const outcomeLabels: Record<string, string> = {
  APPOINTMENT_SET: "Randevu Alındı",
  CALLBACK_REQUESTED: "Geri Arama İstendi",
  INTERESTED: "İlgileniyor",
  NOT_INTERESTED: "İlgilenmiyor",
  VOICEMAIL: "Sesli Mesaj",
  NO_ANSWER: "Cevapsız",
  SALE_CLOSED: "Satış Kapatıldı",
  INFO_SENT: "Bilgi Gönderildi",
  FOLLOW_UP_NEEDED: "Takip Gerekli",
  OTHER: "Diğer",
};

const sentimentEmoji: Record<string, string> = {
  positive: "😊",
  neutral: "😐",
  negative: "😞",
};

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  useEffect(() => {
    fetch("/api/calls")
      .then((r) => r.json())
      .then((d) => {
        setCalls(d.data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Aramalar</h1>
        <p className="text-gray-500 text-sm mt-1">Arama geçmişi ve transkriptler</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
      ) : calls.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Henüz arama yapılmamış</p>
          <p className="text-sm text-gray-400 mt-1">
            Kişiler sayfasından arama başlatabilirsiniz
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Call List */}
          <div className="lg:col-span-1 space-y-2">
            {calls.map((call) => (
              <button
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selectedCall?.id === call.id
                    ? "border-brand-500 bg-brand-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {call.contact.name}
                  </span>
                  {call.sentiment && (
                    <span>{sentimentEmoji[call.sentiment] || ""}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  {call.contact.phone}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      call.status === "COMPLETED"
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {call.status === "COMPLETED" ? "Tamamlandı" : call.status}
                  </span>
                  {call.outcome && (
                    <span className="text-gray-400">
                      {outcomeLabels[call.outcome] || call.outcome}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(call.createdAt).toLocaleString("tr-TR")}
                </p>
              </button>
            ))}
          </div>

          {/* Call Detail */}
          <div className="lg:col-span-2">
            {selectedCall ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedCall.contact.name}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {selectedCall.contact.phone}
                      {selectedCall.contact.company &&
                        ` · ${selectedCall.contact.company}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedCall.duration && (
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {Math.floor(selectedCall.duration / 60)}:
                        {(selectedCall.duration % 60)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {selectedCall.summary && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Özet
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedCall.summary}
                    </p>
                  </div>
                )}

                {/* Transcript */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Transkript
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {(selectedCall.transcript as { messages?: Array<{ speaker: string; text: string }> })?.messages?.map(
                      (msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.speaker === "agent" ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl px-4 py-2 ${
                              msg.speaker === "agent"
                                ? "bg-brand-50 text-brand-900"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-xs font-medium mb-0.5">
                              {msg.speaker === "agent" ? "🤖 Agent" : "👤 Müşteri"}
                            </p>
                            <p className="text-sm">{msg.text}</p>
                          </div>
                        </div>
                      )
                    ) || (
                      <p className="text-sm text-gray-400">
                        Transkript mevcut değil
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  Detayları görmek için bir arama seçin
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
