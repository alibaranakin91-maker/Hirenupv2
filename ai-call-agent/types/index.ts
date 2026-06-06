import { ContactStatus, CallStatus, CallOutcome, CrmNoteType, CallDirection } from "@prisma/client";

export type { ContactStatus, CallStatus, CallOutcome, CrmNoteType, CallDirection };

export interface ConversationMessage {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface CallTranscript {
  messages: TranscriptEntry[];
  startedAt: string;
  endedAt?: string;
}

export interface TranscriptEntry {
  speaker: "agent" | "customer";
  text: string;
  timestamp: string;
}

export interface AgentMemory {
  category: string;
  key: string;
  content: string;
  priority: number;
}

export interface CallInitiateRequest {
  contactId: string;
  agentConfigId?: string;
}

export interface CrmIntegrationPayload {
  event: "call.completed" | "contact.updated" | "note.created" | "appointment.set";
  data: Record<string, unknown>;
  timestamp: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContactImportRow {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  title?: string;
  tags?: string;
  notes?: string;
}

export interface CallAnalysis {
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  outcome: CallOutcome;
  keyPoints: string[];
  nextSteps: string[];
  crmNotes: Array<{
    type: CrmNoteType;
    content: string;
  }>;
}
