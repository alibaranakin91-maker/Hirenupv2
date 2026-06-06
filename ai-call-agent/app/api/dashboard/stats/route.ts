import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isOpenAIConfigured } from "@/lib/openai";
import { isTwilioConfigured } from "@/lib/twilio";

export async function GET() {
  const [
    totalContacts,
    totalCalls,
    totalNotes,
    contactsByStatus,
    callsByStatus,
    recentCalls,
    totalMemories,
    agentConfigs,
  ] = await Promise.all([
    prisma.contact.count(),
    prisma.call.count(),
    prisma.crmNote.count(),
    prisma.contact.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.call.groupBy({ by: ["status"], _count: { id: true } }),
    prisma.call.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        contact: { select: { name: true, phone: true } },
      },
    }),
    prisma.memory.count({ where: { isActive: true } }),
    prisma.agentConfig.count({ where: { isActive: true } }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      totalContacts,
      totalCalls,
      totalNotes,
      totalMemories,
      agentConfigs,
      contactsByStatus: contactsByStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count.id;
          return acc;
        },
        {} as Record<string, number>
      ),
      callsByStatus: callsByStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count.id;
          return acc;
        },
        {} as Record<string, number>
      ),
      recentCalls,
      services: {
        openai: isOpenAIConfigured(),
        twilio: isTwilioConfigured(),
        database: true,
      },
    },
  });
}
