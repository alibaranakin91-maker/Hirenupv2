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

    if (session.user.accountType !== "EMPLOYER") {
      return NextResponse.json(
        { error: "Only employers can create companies" },
        { status: 403 }
      )
    }

    const { name, description, website, industry, size, location, verificationDocuments } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      )
    }

    // Check if user already has a company
    const existingCompany = await prisma.company.findFirst({
      where: { ownerId: session.user.id },
    })

    if (existingCompany) {
      return NextResponse.json(
        { error: "You already have a company registered" },
        { status: 400 }
      )
    }

    // Create company with PENDING verification status
    const company = await prisma.company.create({
      data: {
        name,
        description: description || null,
        website: website || null,
        industry: industry || null,
        size: size || null,
        location: location || null,
        verificationStatus: "PENDING",
        verificationDocuments: verificationDocuments || [],
        ownerId: session.user.id,
      },
      include: {
        owner: true,
      },
    })

    // Add owner as ADMIN member
    await prisma.companyMember.create({
      data: {
        companyId: company.id,
        userId: session.user.id,
        role: "ADMIN",
      },
    })

    return NextResponse.json({ company })
  } catch (error) {
    console.error("Error creating company:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's companies
    const companies = await prisma.company.findMany({
      where: {
        ownerId: session.user.id,
      },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ companies })
  } catch (error) {
    console.error("Error fetching companies:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

