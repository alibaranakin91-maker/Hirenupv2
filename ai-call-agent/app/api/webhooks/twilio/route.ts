import { NextRequest, NextResponse } from "next/server";
import { callEngine } from "@/lib/call-engine";
import { aiConversation } from "@/lib/ai-conversation";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const callId = searchParams.get("callId");

  if (!callId) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response><Say language="tr-TR">Bir hata oluştu.</Say><Hangup/></Response>`,
      { headers: { "Content-Type": "application/xml" } }
    );
  }

  const formData = await req.formData();
  const speechResult = formData.get("SpeechResult") as string | null;

  const call = await prisma.call.findUnique({
    where: { id: callId },
    include: { contact: true },
  });

  if (!call) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response><Say language="tr-TR">Bir hata oluştu.</Say><Hangup/></Response>`,
      { headers: { "Content-Type": "application/xml" } }
    );
  }

  let responseText: string;

  if (!speechResult) {
    responseText = await aiConversation.generateGreeting(
      call.agentConfigId || undefined,
      call.contact.name
    );
    await callEngine.updateCallStatus(callId, "IN_PROGRESS");
  } else {
    responseText = await callEngine.handleIncomingSpeech(callId, speechResult);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="tr-TR" voice="Google.tr-TR-Standard-A">${escapeXml(responseText)}</Say>
  <Gather input="speech" language="tr-TR" speechTimeout="auto" action="${appUrl}/api/webhooks/twilio?callId=${callId}" method="POST">
    <Say language="tr-TR">.</Say>
  </Gather>
  <Say language="tr-TR">Görüşmemiz sona erdi, iyi günler dilerim.</Say>
</Response>`;

  return new NextResponse(twiml, {
    headers: { "Content-Type": "application/xml" },
  });
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
