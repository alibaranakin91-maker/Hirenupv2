import { prisma } from "./prisma";
import type { ContactStatus, CrmNoteType } from "@prisma/client";

export class CrmService {
  async addNote(
    contactId: string,
    callId: string | null,
    type: CrmNoteType,
    content: string,
    status?: string
  ) {
    const note = await prisma.crmNote.create({
      data: { contactId, callId, type, content, status },
    });

    await this.triggerWebhook("note.created", {
      noteId: note.id,
      contactId,
      callId,
      type,
      content,
    });

    return note;
  }

  async updateContactStatus(contactId: string, newStatus: ContactStatus) {
    const contact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        status: newStatus,
        lastCalledAt: new Date(),
      },
    });

    await this.addNote(
      contactId,
      null,
      "STATUS_CHANGE",
      `Durum güncellendi: ${newStatus}`
    );

    await this.triggerWebhook("contact.updated", {
      contactId,
      name: contact.name,
      newStatus,
    });

    return contact;
  }

  async getContactHistory(contactId: string) {
    const [contact, calls, notes] = await Promise.all([
      prisma.contact.findUnique({ where: { id: contactId } }),
      prisma.call.findMany({
        where: { contactId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.crmNote.findMany({
        where: { contactId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    return { contact, calls, notes };
  }

  async getContactStats() {
    const [total, byStatus, recentCalls] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.call.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    const statusCounts = byStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      },
      {} as Record<string, number>
    );

    return { total, statusCounts, recentCalls };
  }

  async triggerWebhook(event: string, data: Record<string, unknown>) {
    const webhooks = await prisma.crmWebhook.findMany({
      where: {
        isActive: true,
        events: { has: event },
      },
    });

    for (const webhook of webhooks) {
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (webhook.secret) {
          headers["X-Webhook-Secret"] = webhook.secret;
        }

        await fetch(webhook.url, {
          method: "POST",
          headers,
          body: JSON.stringify({
            event,
            data,
            timestamp: new Date().toISOString(),
          }),
        });

        await prisma.crmWebhook.update({
          where: { id: webhook.id },
          data: { lastTriggered: new Date() },
        });
      } catch (error) {
        console.error(`Webhook failed (${webhook.url}):`, error);
      }
    }
  }
}

export const crmService = new CrmService();
