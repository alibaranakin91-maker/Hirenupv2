import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { memoryManager } from "@/lib/memory-manager";
import { z } from "zod";

const memorySchema = z.object({
  category: z.string().min(1),
  key: z.string().min(1),
  content: z.string().min(1),
  priority: z.number().optional().default(0),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  if (category) {
    const memories = await memoryManager.getMemoriesByCategory(category);
    return NextResponse.json({ success: true, data: memories });
  }

  const memories = await prisma.memory.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { priority: "desc" }],
  });

  return NextResponse.json({ success: true, data: memories });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = memorySchema.parse(body);
    const memory = await memoryManager.addMemory(
      parsed.category,
      parsed.key,
      parsed.content,
      parsed.priority
    );
    return NextResponse.json(
      { success: true, data: memory },
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
      { success: false, error: "Hafıza eklenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { success: false, error: "id gerekli" },
      { status: 400 }
    );
  }
  await memoryManager.deleteMemory(id);
  return NextResponse.json({ success: true, message: "Hafıza silindi" });
}
