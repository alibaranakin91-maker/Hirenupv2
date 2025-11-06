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

    const { projectId, budget } = await req.json()

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      )
    }

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        entrepreneur: true,
        company: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Get available freelancers based on project requirements
    const freelancers = await prisma.user.findMany({
      where: {
        accountType: "FREELANCER",
        freelancerProfile: {
          isNot: null,
        },
      },
      include: {
        freelancerProfile: true,
        profile: true,
        ratings: true,
      },
      take: 50,
    })

    // AI-based team suggestions (simplified - in production, use actual AI)
    const suggestions = generateTeamSuggestions(project, budget, freelancers)

    // Save suggestions
    for (const suggestion of suggestions) {
      await prisma.teamSuggestion.create({
        data: {
          projectId,
          role: suggestion.role,
          skills: suggestion.skills,
          experience: suggestion.experience,
          budgetRange: suggestion.budgetRange,
          suggestedFreelancers: suggestion.suggestedFreelancers,
          reason: suggestion.reason,
        },
      })
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Error generating team suggestions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function generateTeamSuggestions(project: any, budget: number | null, freelancers: any[]) {
  const suggestions = []

  // Determine required roles based on project
  const roles = determineRequiredRoles(project.description, project.industry)

  const availableBudget = budget || 100000 // Default budget if not specified
  const budgetPerRole = availableBudget / roles.length

  for (const role of roles) {
    // Find matching freelancers
    const matchingFreelancers = freelancers
      .filter((f) => {
        const skills = f.profile?.skills || []
        return role.requiredSkills.some((skill: string) =>
          skills.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))
        )
      })
      .slice(0, 5)
      .map((f) => ({
        id: f.id,
        name: f.name,
        rating: f.freelancerProfile?.rating || 0,
        hourlyRate: f.profile?.hourlyRate || 0,
      }))

    suggestions.push({
      role: role.name,
      skills: role.requiredSkills,
      experience: role.experience,
      budgetRange: {
        min: budgetPerRole * 0.7,
        max: budgetPerRole * 1.3,
        currency: "TRY",
      },
      suggestedFreelancers: matchingFreelancers,
      reason: role.reason,
    })
  }

  return suggestions
}

function determineRequiredRoles(description: string, industry: string | null) {
  const desc = (description || "").toLowerCase()
  const roles = []

  if (desc.includes("web") || desc.includes("site") || desc.includes("uygulama")) {
    roles.push({
      name: "Frontend Developer",
      requiredSkills: ["react", "next.js", "javascript", "typescript", "css"],
      experience: "3+ yıl",
      reason: "Web uygulaması geliştirmesi için frontend geliştirici gereklidir.",
    })

    roles.push({
      name: "Backend Developer",
      requiredSkills: ["node.js", "python", "api", "database", "server"],
      experience: "3+ yıl",
      reason: "Backend altyapısı ve API geliştirmesi için backend geliştirici gereklidir.",
    })

    roles.push({
      name: "UI/UX Designer",
      requiredSkills: ["design", "figma", "ui", "ux", "prototyping"],
      experience: "2+ yıl",
      reason: "Kullanıcı arayüzü ve kullanıcı deneyimi tasarımı için tasarımcı gereklidir.",
    })
  }

  if (desc.includes("mobil") || desc.includes("app") || desc.includes("ios") || desc.includes("android")) {
    roles.push({
      name: "Mobile Developer",
      requiredSkills: ["react native", "flutter", "ios", "android", "mobile"],
      experience: "3+ yıl",
      reason: "Mobil uygulama geliştirmesi için mobil geliştirici gereklidir.",
    })
  }

  if (desc.includes("pazarlama") || desc.includes("marketing") || desc.includes("tanıtım")) {
    roles.push({
      name: "Marketing Specialist",
      requiredSkills: ["marketing", "seo", "social media", "advertising"],
      experience: "2+ yıl",
      reason: "Projenin tanıtımı ve pazarlaması için pazarlama uzmanı gereklidir.",
    })
  }

  // Default roles if no specific match
  if (roles.length === 0) {
    roles.push(
      {
        name: "Proje Yöneticisi",
        requiredSkills: ["project management", "planning", "coordination"],
        experience: "3+ yıl",
        reason: "Proje yönetimi ve koordinasyon için PM gereklidir.",
      },
      {
        name: "Full Stack Developer",
        requiredSkills: ["react", "node.js", "database", "api"],
        experience: "3+ yıl",
        reason: "Genel geliştirme ihtiyaçları için full stack geliştirici gereklidir.",
      }
    )
  }

  return roles
}

