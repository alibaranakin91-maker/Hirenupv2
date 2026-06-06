import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { callEngine } from "@/lib/call-engine";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const contactId = searchParams.get("contactId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (contactId) where.contactId = contactId;

  const [calls, total] = await Promise.all([
    prisma.call.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        contact: { select: { name: true, phone: true, company: true } },
      },
    }),
    prisma.call.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: calls,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { contactId, agentConfigId } = await req.json();
    if (!contactId) {
      return NextResponse.json(
        { success: false, error: "contactId gerekli" },
        { status: 400 }
      );
    }
    const result = await callEngine.initiateCall(contactId, agentConfigId);
    return NextResponse.json({
      success: result.success,
      data: { callId: result.callId },
      message: result.message,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Arama başlatılamadı";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
