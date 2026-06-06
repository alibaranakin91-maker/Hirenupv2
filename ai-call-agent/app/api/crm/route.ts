import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { crmService } from "@/lib/crm-service";
import { callEngine } from "@/lib/call-engine";

function validateApiKey(req: NextRequest): boolean {
  const apiKey =
    req.headers.get("x-api-key") ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  return apiKey === process.env.CRM_API_KEY;
}

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  switch (action) {
    case "stats": {
      const stats = await crmService.getContactStats();
      return NextResponse.json({ success: true, data: stats });
    }
    case "contacts": {
      const status = searchParams.get("status") || undefined;
      const contacts = await prisma.contact.findMany({
        where: status ? { status: status as never } : undefined,
        orderBy: { updatedAt: "desc" },
        take: 100,
      });
      return NextResponse.json({ success: true, data: contacts });
    }
    case "history": {
      const contactId = searchParams.get("contactId");
      if (!contactId)
        return NextResponse.json({ error: "contactId gerekli" }, { status: 400 });
      const history = await crmService.getContactHistory(contactId);
      return NextResponse.json({ success: true, data: history });
    }
    default:
      return NextResponse.json(
        {
          success: true,
          message: "AI Call Agent CRM API",
          endpoints: {
            "GET ?action=stats": "İstatistikleri getir",
            "GET ?action=contacts": "Kişileri listele",
            "GET ?action=history&contactId=X": "Kişi geçmişi",
            "POST": "Aksiyon çalıştır (call, add-note, update-status, add-contact, register-webhook)",
          },
        },
        { status: 200 }
      );
  }
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;

  switch (action) {
    case "call": {
      const result = await callEngine.initiateCall(
        body.contactId,
        body.agentConfigId
      );
      return NextResponse.json({
        success: result.success,
        data: { callId: result.callId },
        message: result.message,
      });
    }
    case "add-note": {
      const note = await crmService.addNote(
        body.contactId,
        body.callId || null,
        body.type || "GENERAL",
        body.content,
        body.status
      );
      return NextResponse.json({ success: true, data: note });
    }
    case "update-status": {
      const contact = await crmService.updateContactStatus(
        body.contactId,
        body.status
      );
      return NextResponse.json({ success: true, data: contact });
    }
    case "add-contact": {
      const contact = await prisma.contact.create({
        data: {
          name: body.name,
          phone: body.phone,
          email: body.email,
          company: body.company,
          title: body.title,
          tags: body.tags || [],
          notes: body.notes,
        },
      });
      return NextResponse.json({ success: true, data: contact });
    }
    case "register-webhook": {
      const webhook = await prisma.crmWebhook.create({
        data: {
          url: body.url,
          events: body.events || [
            "call.completed",
            "contact.updated",
            "note.created",
          ],
          secret: body.secret,
        },
      });
      return NextResponse.json({ success: true, data: webhook });
    }
    default:
      return NextResponse.json(
        { success: false, error: `Bilinmeyen aksiyon: ${action}` },
        { status: 400 }
      );
  }
}
