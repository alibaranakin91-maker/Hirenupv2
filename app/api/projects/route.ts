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

    const { name, description, budget, industry, timeline, requirements } = await req.json()

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      )
    }

    // Check if user is entrepreneur or employer
    const isEntrepreneur = session.user.accountType === "ENTREPRENEUR"
    const isEmployer = session.user.accountType === "EMPLOYER"

    if (!isEntrepreneur && !isEmployer) {
      return NextResponse.json(
        { error: "Only entrepreneurs and employers can create projects" },
        { status: 403 }
      )
    }

    let companyId = null
    if (isEmployer) {
      // Get user's company
      const companyMember = await prisma.companyMember.findFirst({
        where: {
          userId: session.user.id,
          role: { in: ["ADMIN", "MANAGER"] },
        },
        include: { company: true },
      })
      if (companyMember) {
        companyId = companyMember.companyId
      }
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        budget: budget || null,
        estimatedBudget: budget || null,
        industry: industry || null,
        timeline: timeline || null,
        requirements: requirements || null,
        status: "planning",
        createdById: session.user.id,
        entrepreneurId: isEntrepreneur ? session.user.id : null,
        companyId: companyId,
      },
      include: {
        entrepreneur: true,
        company: true,
      },
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error creating project:", error)
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

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") // "entrepreneur" or "company"

    let projects
    if (type === "entrepreneur") {
      projects = await prisma.project.findMany({
        where: {
          entrepreneurId: session.user.id,
        },
        include: {
          entrepreneur: true,
          company: true,
        },
        orderBy: { createdAt: "desc" },
      })
    } else if (type === "company") {
      const companyMember = await prisma.companyMember.findFirst({
        where: { userId: session.user.id },
      })
      
      if (companyMember) {
        projects = await prisma.project.findMany({
          where: {
            companyId: companyMember.companyId,
          },
          include: {
            entrepreneur: true,
            company: true,
          },
          orderBy: { createdAt: "desc" },
        })
      } else {
        projects = []
      }
    } else {
      // Get all projects user has access to
      projects = await prisma.project.findMany({
        where: {
          OR: [
            { entrepreneurId: session.user.id },
            { createdById: session.user.id },
            {
              company: {
                members: {
                  some: { userId: session.user.id },
                },
              },
            },
          ],
        },
        include: {
          entrepreneur: true,
          company: true,
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

