import { prisma } from "./prisma";
import type { AgentMemory } from "@/types";

export class MemoryManager {
  async getMemoriesByCategory(category: string): Promise<AgentMemory[]> {
    const memories = await prisma.memory.findMany({
      where: { category, isActive: true },
      orderBy: { priority: "desc" },
    });
    return memories.map((m) => ({
      category: m.category,
      key: m.key,
      content: m.content,
      priority: m.priority,
    }));
  }

  async getAllActiveMemories(): Promise<AgentMemory[]> {
    const memories = await prisma.memory.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { priority: "desc" }],
    });
    return memories.map((m) => ({
      category: m.category,
      key: m.key,
      content: m.content,
      priority: m.priority,
    }));
  }

  async addMemory(
    category: string,
    key: string,
    content: string,
    priority = 0
  ) {
    return prisma.memory.upsert({
      where: { category_key: { category, key } },
      update: { content, priority, isActive: true, updatedAt: new Date() },
      create: { category, key, content, priority },
    });
  }

  async removeMemory(id: string) {
    return prisma.memory.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async deleteMemory(id: string) {
    return prisma.memory.delete({ where: { id } });
  }

  buildMemoryContext(): Promise<string> {
    return this.getAllActiveMemories().then((memories) => {
      if (memories.length === 0) return "";

      const grouped = memories.reduce(
        (acc, m) => {
          if (!acc[m.category]) acc[m.category] = [];
          acc[m.category].push(m);
          return acc;
        },
        {} as Record<string, AgentMemory[]>
      );

      let context = "## Hafıza ve Bilgi Tabanı\n\n";
      for (const [category, items] of Object.entries(grouped)) {
        context += `### ${category}\n`;
        for (const item of items) {
          context += `- **${item.key}**: ${item.content}\n`;
        }
        context += "\n";
      }
      return context;
    });
  }
}

export const memoryManager = new MemoryManager();
