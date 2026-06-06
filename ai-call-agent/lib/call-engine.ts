import { prisma } from "./prisma";
import { getTwilio, getTwilioPhoneNumber, isTwilioConfigured } from "./twilio";
import { aiConversation } from "./ai-conversation";
import { crmService } from "./crm-service";
import type { CallStatus, CallOutcome } from "@prisma/client";
import type { TranscriptEntry } from "@/types";

export class CallEngine {
  private activeTranscripts: Map<string, TranscriptEntry[]> = new Map();

  async initiateCall(
    contactId: string,
    agentConfigId?: string
  ): Promise<{ callId: string; success: boolean; message: string }> {
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      return { callId: "", success: false, message: "Kişi bulunamadı" };
    }

    const call = await prisma.call.create({
      data: {
        contactId,
        agentConfigId,
        status: "QUEUED",
        direction: "OUTBOUND",
        transcript: { messages: [] },
      },
    });

    if (!isTwilioConfigured()) {
      await this.simulateCall(call.id, contact.name, contact.company);
      return {
        callId: call.id,
        success: true,
        message: "Arama simüle edildi (Twilio yapılandırılmamış)",
      };
    }

    try {
      const client = getTwilio()!;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

      const twilioCall = await client.calls.create({
        to: contact.phone,
        from: getTwilioPhoneNumber(),
        url: `${appUrl}/api/webhooks/twilio?callId=${call.id}`,
        statusCallback: `${appUrl}/api/webhooks/twilio/status?callId=${call.id}`,
        statusCallbackEvent: [
          "initiated",
          "ringing",
          "answered",
          "completed",
        ],
        record: true,
      });

      await prisma.call.update({
        where: { id: call.id },
        data: {
          twilioCallSid: twilioCall.sid,
          status: "RINGING",
        },
      });

      return {
        callId: call.id,
        success: true,
        message: `Arama başlatıldı: ${contact.name}`,
      };
    } catch (error) {
      await prisma.call.update({
        where: { id: call.id },
        data: { status: "FAILED" },
      });
      const errorMsg =
        error instanceof Error ? error.message : "Bilinmeyen hata";
      return {
        callId: call.id,
        success: false,
        message: `Arama başarısız: ${errorMsg}`,
      };
    }
  }

  async handleIncomingSpeech(
    callId: string,
    speechText: string
  ): Promise<string> {
    const call = await prisma.call.findUnique({
      where: { id: callId },
      include: { contact: true, agentConfig: true },
    });

    if (!call) return "Bir hata oluştu, lütfen daha sonra tekrar arayın.";

    if (!this.activeTranscripts.has(callId)) {
      this.activeTranscripts.set(callId, []);
    }
    const transcript = this.activeTranscripts.get(callId)!;
    transcript.push({
      speaker: "customer",
      text: speechText,
      timestamp: new Date().toISOString(),
    });

    const response = await aiConversation.generateResponse(
      callId,
      speechText,
      call.agentConfigId || undefined,
      call.contact.name,
      call.contact.company || undefined
    );

    transcript.push({
      speaker: "agent",
      text: response,
      timestamp: new Date().toISOString(),
    });

    await prisma.call.update({
      where: { id: callId },
      data: { transcript: { messages: transcript } },
    });

    return response;
  }

  async completeCall(
    callId: string,
    outcome?: CallOutcome
  ): Promise<void> {
    const transcript = this.activeTranscripts.get(callId) || [];

    const analysis = await aiConversation.analyzeCall(callId, transcript);

    await prisma.call.update({
      where: { id: callId },
      data: {
        status: "COMPLETED",
        endedAt: new Date(),
        duration: transcript.length > 0 ? Math.floor(transcript.length * 15) : 0,
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        outcome: outcome || (analysis.outcome as CallOutcome) || "OTHER",
        transcript: { messages: transcript },
      },
    });

    const call = await prisma.call.findUnique({
      where: { id: callId },
      include: { contact: true },
    });

    if (call) {
      for (const note of analysis.crmNotes) {
        await crmService.addNote(
          call.contactId,
          callId,
          note.type as never,
          note.content
        );
      }

      const statusMap: Record<string, string> = {
        APPOINTMENT_SET: "APPOINTMENT_SET",
        SALE_CLOSED: "SALE_CLOSED",
        INTERESTED: "INTERESTED",
        NOT_INTERESTED: "NOT_INTERESTED",
        CALLBACK_REQUESTED: "FOLLOW_UP",
        FOLLOW_UP_NEEDED: "FOLLOW_UP",
      };

      const newStatus = statusMap[analysis.outcome];
      if (newStatus) {
        await crmService.updateContactStatus(
          call.contactId,
          newStatus as never
        );
      }

      await crmService.triggerWebhook("call.completed", {
        callId: call.id,
        contactId: call.contactId,
        contactName: call.contact.name,
        outcome: analysis.outcome,
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        notes: analysis.crmNotes,
      });
    }

    aiConversation.clearCallHistory(callId);
    this.activeTranscripts.delete(callId);
  }

  async updateCallStatus(callId: string, status: CallStatus) {
    const data: Record<string, unknown> = { status };
    if (status === "IN_PROGRESS") data.startedAt = new Date();
    if (status === "COMPLETED" || status === "FAILED") data.endedAt = new Date();

    await prisma.call.update({ where: { id: callId }, data });
  }

  private async simulateCall(
    callId: string,
    contactName: string,
    company: string | null
  ): Promise<void> {
    const greeting = await aiConversation.generateGreeting(
      undefined,
      contactName
    );

    const simulatedConversation: TranscriptEntry[] = [
      {
        speaker: "agent",
        text: greeting,
        timestamp: new Date().toISOString(),
      },
      {
        speaker: "customer",
        text: "Merhaba, buyurun?",
        timestamp: new Date(Date.now() + 3000).toISOString(),
      },
    ];

    const customerResponses = [
      "Evet, dinliyorum.",
      "Hmm, ilginç. Biraz daha anlatır mısınız?",
      "Fiyatlar nasıl peki?",
      "Anladım, düşüneyim bir. Yarın tekrar arayabilir misiniz?",
    ];

    for (const customerText of customerResponses) {
      simulatedConversation.push({
        speaker: "customer",
        text: customerText,
        timestamp: new Date(
          Date.now() + simulatedConversation.length * 5000
        ).toISOString(),
      });

      const response = await aiConversation.generateResponse(
        callId,
        customerText,
        undefined,
        contactName,
        company || undefined
      );

      simulatedConversation.push({
        speaker: "agent",
        text: response,
        timestamp: new Date(
          Date.now() + simulatedConversation.length * 5000
        ).toISOString(),
      });
    }

    this.activeTranscripts.set(callId, simulatedConversation);

    await prisma.call.update({
      where: { id: callId },
      data: {
        status: "IN_PROGRESS",
        startedAt: new Date(),
      },
    });

    await this.completeCall(callId, "CALLBACK_REQUESTED");
  }
}

export const callEngine = new CallEngine();
