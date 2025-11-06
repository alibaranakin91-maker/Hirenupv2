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

    // Get user's direct permissions
    const directPermissions = await prisma.permission.findMany({
      where: {
        userId: session.user.id,
        granted: true,
      },
      include: {
        granter: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Get shared permissions
    const sharedPermissions = await prisma.permissionShare.findMany({
      where: {
        sharedWithId: session.user.id,
      },
      include: {
        sharer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Get company-based permissions (if user is a company member)
    const companyMemberships = await prisma.companyMember.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        company: {
          include: {
            members: {
              where: {
                userId: session.user.id,
              },
            },
          },
        },
      },
    })

    // Role-based permissions
    const rolePermissions: string[] = []
    companyMemberships.forEach((membership) => {
      if (membership.role === "ADMIN") {
        rolePermissions.push("API_ACCESS", "COMPANY_INFO_EDIT", "REPORT_VIEW", "REPORT_CREATE", "TASK_ASSIGN", "USER_MANAGE", "FINANCIAL_VIEW")
      } else if (membership.role === "MANAGER") {
        rolePermissions.push("API_ACCESS", "REPORT_VIEW", "REPORT_CREATE", "TASK_ASSIGN", "USER_MANAGE")
      } else if (membership.role === "EMPLOYEE") {
        rolePermissions.push("REPORT_VIEW", "TASK_ASSIGN")
      }
    })

    // Combine all permissions
    const allPermissions = [
      ...directPermissions.map((p) => p.type),
      ...sharedPermissions.map((sp) => {
        // Get the original permission type from shared permission
        return "API_ACCESS" // This should be fetched from the actual permission
      }),
      ...rolePermissions,
    ]

    const uniquePermissions = Array.from(new Set(allPermissions))

    return NextResponse.json({
      permissions: directPermissions,
      sharedPermissions,
      rolePermissions,
      allPermissions: uniquePermissions,
    })
  } catch (error) {
    console.error("Error fetching permissions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

