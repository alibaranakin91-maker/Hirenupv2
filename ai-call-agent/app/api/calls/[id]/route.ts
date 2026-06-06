import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const call = await prisma.call.findUnique({
    where: { id: params.id },
    include: {
      contact: true,
      crmNotes: { orderBy: { createdAt: "desc" } },
      agentConfig: true,
    },
  });

  if (!call) {
    return NextResponse.json(
      { success: false, error: "Arama bulunamadı" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: call });
}
