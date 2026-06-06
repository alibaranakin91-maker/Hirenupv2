import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const configSchema = z.object({
  name: z.string().min(1),
  personality: z.string().optional(),
  greeting: z.string().optional(),
  objective: z.string().optional(),
  instructions: z.string().optional(),
  fallbackResponse: z.string().optional(),
  voiceId: z.string().optional(),
  language: z.string().optional(),
  maxCallDuration: z.number().optional(),
});

export async function GET() {
  const configs = await prisma.agentConfig.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { calls: true } } },
  });
  return NextResponse.json({ success: true, data: configs });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = configSchema.parse(body);
    const config = await prisma.agentConfig.create({ data: parsed });
    return NextResponse.json(
      { success: true, data: config },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Yapılandırma oluşturulamadı" },
      { status: 500 }
    );
  }
}
