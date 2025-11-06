import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateTOTPSecret, generateBackupCodes } from "@/lib/totp"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { secret, qrCode } = await generateTOTPSecret(session.user.email!)

    // Generate backup codes
    const backupCodes = generateBackupCodes(10)

    // Save backup codes
    await prisma.twoFactorBackupCode.createMany({
      data: backupCodes.map((code) => ({
        userId: session.user.id!,
        code,
      })),
    })

    return NextResponse.json({
      secret,
      qrCode,
      backupCodes,
    })
  } catch (error) {
    console.error("Error setting up 2FA:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { secret, code } = await req.json()

    // Verify the code before enabling
    const { verifyTOTP } = await import("@/lib/totp")
    const isValid = await verifyTOTP(secret, code)

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      )
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: session.user.id! },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        twoFactorMethod: "TOTP",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error enabling 2FA:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: session.user.id! },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorMethod: null,
      },
    })

    // Delete backup codes
    await prisma.twoFactorBackupCode.deleteMany({
      where: { userId: session.user.id! },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error disabling 2FA:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

