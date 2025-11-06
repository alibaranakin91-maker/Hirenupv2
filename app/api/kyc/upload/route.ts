import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "front", "back", "selfie"

    if (!file || !type) {
      return NextResponse.json({ error: "Missing file or type" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "kyc", session.user.id!)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${type}-${timestamp}-${file.name}`
    const filepath = join(uploadsDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return public URL
    const url = `/uploads/kyc/${session.user.id}/${filename}`

    // Update KYC verification record
    const kycVerification = await prisma.kYCVerification.upsert({
      where: { userId: session.user.id! },
      create: {
        userId: session.user.id!,
        status: "PENDING",
        ...(type === "front" && { documentFront: url }),
        ...(type === "back" && { documentBack: url }),
        ...(type === "selfie" && { selfiePhoto: url }),
      },
      update: {
        status: "PENDING",
        ...(type === "front" && { documentFront: url }),
        ...(type === "back" && { documentBack: url }),
        ...(type === "selfie" && { selfiePhoto: url }),
      },
    })

    return NextResponse.json({ url, kycVerification })
  } catch (error) {
    console.error("Error uploading KYC document:", error)
    return NextResponse.json(
      { error: "File upload failed" },
      { status: 500 }
    )
  }
}

