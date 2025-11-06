import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const kycVerification = await prisma.kYCVerification.findUnique({
      where: { userId: session.user.id! },
    })

    return NextResponse.json({
      status: kycVerification?.status || "NOT_STARTED",
      kycVerification,
    })
  } catch (error) {
    console.error("Error fetching KYC status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

