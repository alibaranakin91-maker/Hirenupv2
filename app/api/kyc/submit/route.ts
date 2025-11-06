import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentType } = await req.json()

    // Get KYC verification
    const kycVerification = await prisma.kYCVerification.findUnique({
      where: { userId: session.user.id! },
    })

    if (!kycVerification) {
      return NextResponse.json(
        { error: "KYC documents not uploaded" },
        { status: 400 }
      )
    }

    if (!kycVerification.documentFront || !kycVerification.selfiePhoto) {
      return NextResponse.json(
        { error: "Missing required documents" },
        { status: 400 }
      )
    }

    // Update KYC status to PENDING
    const updated = await prisma.kYCVerification.update({
      where: { userId: session.user.id! },
      data: {
        status: "PENDING",
        documentType: documentType || "ID",
      },
    })

    return NextResponse.json({ kycVerification: updated })
  } catch (error) {
    console.error("Error submitting KYC:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

