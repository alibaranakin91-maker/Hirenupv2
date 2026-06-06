import { getOpenAI } from "./openai";
import { memoryManager } from "./memory-manager";
import { prisma } from "./prisma";
import type {
  ConversationMessage,
  CallAnalysis,
  TranscriptEntry,
} from "@/types";

export class AIConversationEngine {
  private conversationHistory: Map<string, ConversationMessage[]> = new Map();

  async buildSystemPrompt(
    agentConfigId?: string,
    contactName?: string,
    contactCompany?: string
  ): Promise<string> {
    const memoryContext = await memoryManager.buildMemoryContext();

    let agentInstructions = "";
    if (agentConfigId) {
      const config = await prisma.agentConfig.findUnique({
        where: { id: agentConfigId },
      });
      if (config) {
        agentInstructions = [
          config.personality && `## Kişilik\n${config.personality}`,
          config.objective && `## Amaç\n${config.objective}`,
          config.instructions && `## Talimatlar\n${config.instructions}`,
          config.greeting && `## Karşılama Metni\n${config.greeting}`,
        ]
          .filter(Boolean)
          .join("\n\n");
      }
    }

    const contactContext = contactName
      ? `\n## Mevcut Müşteri Bilgisi\n- İsim: ${contactName}${contactCompany ? `\n- Şirket: ${contactCompany}` : ""}\n`
      : "";

    return `Sen profesyonel bir telefon satış temsilcisisin. Tamamen insan gibi konuşmalısın - doğal, samimi ve profesyonel ol. Müşteri bir yapay zeka ile konuştuğunu kesinlikle anlamamalı.

Önemli kurallar:
- Her zaman Türkçe konuş (aksi belirtilmedikçe).
- Doğal konuşma kalıpları kullan - "ıı", "hmm", "şöyle söyleyeyim" gibi ara sözcükler kullanabilirsin.
- Müşterinin sorularına net ve bilgili cevaplar ver.
- Satış odaklı ol ama baskıcı olma.
- Müşterinin itirazlarına empati ile yaklaş.
- Gerektiğinde randevu ayarla veya geri arama teklif et.
- Konuşma boyunca önemli bilgileri not al.
- Hafızandaki bilgileri doğal bir şekilde kullan, ezbere okuyor gibi olma.

${agentInstructions}

${memoryContext}

${contactContext}

Yanıtların kısa ve doğal olsun - uzun monologlardan kaçın. Gerçek bir telefon konuşması gibi davran.`;
  }

  async generateResponse(
    callId: string,
    userMessage: string,
    agentConfigId?: string,
    contactName?: string,
    contactCompany?: string
  ): Promise<string> {
    const openai = getOpenAI();

    if (!this.conversationHistory.has(callId)) {
      const systemPrompt = await this.buildSystemPrompt(
        agentConfigId,
        contactName,
        contactCompany
      );
      this.conversationHistory.set(callId, [
        { role: "system", content: systemPrompt },
      ]);
    }

    const history = this.conversationHistory.get(callId)!;
    history.push({
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    });

    if (!openai) {
      const fallback = this.generateFallbackResponse(userMessage);
      history.push({
        role: "assistant",
        content: fallback,
        timestamp: new Date(),
      });
      return fallback;
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: history.map((m) => ({ role: m.role, content: m.content })),
        temperature: 0.8,
        max_tokens: 300,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      });

      const assistantMessage =
        response.choices[0]?.message?.content ||
        "Bir saniye, tekrar edebilir misiniz?";

      history.push({
        role: "assistant",
        content: assistantMessage,
        timestamp: new Date(),
      });

      return assistantMessage;
    } catch (error) {
      console.error("OpenAI API error:", error);
      const fallback = "Bir saniye, sizi anlıyorum. Devam edelim mi?";
      history.push({
        role: "assistant",
        content: fallback,
        timestamp: new Date(),
      });
      return fallback;
    }
  }

  async generateGreeting(
    agentConfigId?: string,
    contactName?: string
  ): Promise<string> {
    if (agentConfigId) {
      const config = await prisma.agentConfig.findUnique({
        where: { id: agentConfigId },
      });
      if (config?.greeting) {
        return config.greeting.replace("{{name}}", contactName || "");
      }
    }
    const name = contactName ? ` ${contactName} Bey/Hanım` : "";
    return `Merhaba${name}, ben HireNUp'tan arıyorum. Nasılsınız? Kısa bir sürenizi alabilir miyim?`;
  }

  async analyzeCall(
    callId: string,
    transcript: TranscriptEntry[]
  ): Promise<CallAnalysis> {
    const openai = getOpenAI();

    const transcriptText = transcript
      .map(
        (t) =>
          `${t.speaker === "agent" ? "Temsilci" : "Müşteri"}: ${t.text}`
      )
      .join("\n");

    if (!openai) {
      return {
        summary: "Görüşme tamamlandı. (AI analizi için OpenAI API anahtarı gereklidir)",
        sentiment: "neutral",
        outcome: "OTHER",
        keyPoints: ["Görüşme kaydedildi"],
        nextSteps: ["Manuel değerlendirme yapılmalı"],
        crmNotes: [
          {
            type: "CALL_SUMMARY",
            content: `Görüşme tamamlandı. Transkript:\n${transcriptText}`,
          },
        ],
      };
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `Bir satış görüşmesi transkriptini analiz et. JSON formatında yanıt ver:
{
  "summary": "Görüşmenin kısa özeti",
  "sentiment": "positive|neutral|negative",
  "outcome": "APPOINTMENT_SET|CALLBACK_REQUESTED|INTERESTED|NOT_INTERESTED|VOICEMAIL|SALE_CLOSED|INFO_SENT|FOLLOW_UP_NEEDED|OTHER",
  "keyPoints": ["önemli noktalar"],
  "nextSteps": ["sonraki adımlar"],
  "crmNotes": [{"type": "CALL_SUMMARY|STATUS_CHANGE|APPOINTMENT|FOLLOW_UP|SALE|OBJECTION|FEEDBACK", "content": "not içeriği"}]
}`,
          },
          { role: "user", content: transcriptText },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const analysis = JSON.parse(
        response.choices[0]?.message?.content || "{}"
      );

      return {
        summary: analysis.summary || "Görüşme analiz edildi",
        sentiment: analysis.sentiment || "neutral",
        outcome: analysis.outcome || "OTHER",
        keyPoints: analysis.keyPoints || [],
        nextSteps: analysis.nextSteps || [],
        crmNotes: analysis.crmNotes || [],
      };
    } catch (error) {
      console.error("Call analysis error:", error);
      return {
        summary: "Görüşme tamamlandı (analiz hatası)",
        sentiment: "neutral",
        outcome: "OTHER",
        keyPoints: [],
        nextSteps: [],
        crmNotes: [
          { type: "CALL_SUMMARY", content: "Görüşme tamamlandı." },
        ],
      };
    }
  }

  clearCallHistory(callId: string) {
    this.conversationHistory.delete(callId);
  }

  private generateFallbackResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();

    if (
      lower.includes("merhaba") ||
      lower.includes("selam") ||
      lower.includes("günaydın")
    ) {
      return "Merhaba! Nasılsınız? Size kısaca bilgi vermek istiyordum, uygun musunuz?";
    }
    if (
      lower.includes("meşgul") ||
      lower.includes("müsait değil") ||
      lower.includes("şu an olmaz")
    ) {
      return "Anlıyorum, sizi rahatsız etmek istemem. Size ne zaman tekrar arasam uygun olur?";
    }
    if (lower.includes("fiyat") || lower.includes("ücret") || lower.includes("maliyet")) {
      return "Tabii, fiyatlarımız hakkında detaylı bilgi verebilirim. Size özel bir teklif hazırlamamı ister misiniz?";
    }
    if (lower.includes("hayır") || lower.includes("istemiyorum")) {
      return "Anlıyorum, teşekkür ederim. İleride ihtiyacınız olursa bizi arayabilirsiniz. İyi günler dilerim!";
    }
    if (lower.includes("randevu") || lower.includes("görüşme")) {
      return "Harika! Size en uygun gün ve saat hangisi? Hemen bir randevu ayarlayalım.";
    }

    return "Tabii, sizi anlıyorum. Bu konuda size daha detaylı bilgi verebilirim. Devam edelim mi?";
  }
}

export const aiConversation = new AIConversationEngine();
