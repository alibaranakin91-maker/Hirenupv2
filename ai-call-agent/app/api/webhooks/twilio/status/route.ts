import { NextRequest, NextResponse } from "next/server";
import { callEngine } from "@/lib/call-engine";
import type { CallStatus } from "@prisma/client";

const twilioStatusMap: Record<string, CallStatus> = {
  initiated: "QUEUED",
  ringing: "RINGING",
  "in-progress": "IN_PROGRESS",
  completed: "COMPLETED",
  failed: "FAILED",
  "no-answer": "NO_ANSWER",
  busy: "BUSY",
  canceled: "CANCELLED",
};

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const callId = searchParams.get("callId");

  if (!callId) {
    return NextResponse.json({ error: "callId gerekli" }, { status: 400 });
  }

  const formData = await req.formData();
  const callStatus = formData.get("CallStatus") as string;
  const mappedStatus = twilioStatusMap[callStatus] || "COMPLETED";

  if (mappedStatus === "COMPLETED" || mappedStatus === "FAILED" || mappedStatus === "NO_ANSWER") {
    await callEngine.completeCall(callId);
  } else {
    await callEngine.updateCallStatus(callId, mappedStatus);
  }

  return NextResponse.json({ success: true });
}
