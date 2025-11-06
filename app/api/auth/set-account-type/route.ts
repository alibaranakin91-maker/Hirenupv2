import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AccountType } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { accountType } = await req.json()

    if (!Object.values(AccountType).includes(accountType)) {
      return NextResponse.json({ error: "Invalid account type" }, { status: 400 })
    }

    // Update user account type
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { accountType },
    })

    // Create profile based on account type
    switch (accountType) {
      case AccountType.FREELANCER:
        await prisma.freelancerProfile.upsert({
          where: { userId: user.id },
          create: { userId: user.id },
          update: {},
        })
        break
      case AccountType.ENTREPRENEUR:
        await prisma.entrepreneurProfile.upsert({
          where: { userId: user.id },
          create: { userId: user.id },
          update: {},
        })
        break
      case AccountType.WORKER:
        await prisma.workerProfile.upsert({
          where: { userId: user.id },
          create: { userId: user.id },
          update: {},
        })
        break
      case AccountType.EMPLOYER:
        await prisma.employerProfile.upsert({
          where: { userId: user.id },
          create: { userId: user.id },
          update: {},
        })
        break
      case AccountType.INVESTOR:
        await prisma.investorProfile.upsert({
          where: { userId: user.id },
          create: { userId: user.id },
          update: {},
        })
        break
    }

    return NextResponse.json({ success: true, accountType })
  } catch (error) {
    console.error("Error setting account type:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

