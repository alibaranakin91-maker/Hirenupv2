import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { crmService } from "@/lib/crm-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const history = await crmService.getContactHistory(params.id);
  if (!history.contact) {
    return NextResponse.json(
      { success: false, error: "Kişi bulunamadı" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: history });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const contact = await prisma.contact.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json({ success: true, data: contact });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.contact.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true, message: "Kişi silindi" });
}
