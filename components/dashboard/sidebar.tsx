"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  User, 
  Building2, 
  Bell, 
  Settings, 
  BarChart3, 
  Users, 
  Briefcase, 
  FolderKanban,
  Presentation,
  FileText,
  Zap,
  Shield,
  Megaphone,
  ChevronRight
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MenuItem {
  label: string
  href: string
  icon: React.ReactNode
  requiresPermission?: string
  children?: MenuItem[]
}

export function DashboardSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [userPermissions, setUserPermissions] = useState<string[]>([])
  const [userCompanies, setUserCompanies] = useState<any[]>([])
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  useEffect(() => {
    // Fetch user permissions and companies
    const fetchData = async () => {
      if (session?.user?.id) {
        try {
          const [permsRes, companiesRes] = await Promise.all([
            fetch("/api/permissions/my-permissions"),
            fetch("/api/companies/my-companies"),
          ])
          
          if (permsRes.ok) {
            const perms = await permsRes.json()
            setUserPermissions(perms.permissions?.map((p: any) => p.type) || [])
          }
          
          if (companiesRes.ok) {
            const companies = await companiesRes.json()
            setUserCompanies(companies.companies || [])
          }
        } catch (error) {
          console.error("Error fetching data:", error)
        }
      }
    }
    fetchData()
  }, [session])

  const accountType = session?.user?.accountType

  const hasPermission = (permission: string) => {
    return userPermissions.includes(permission)
  }

  const toggleExpand = (item: string) => {
    setExpandedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      {
        label: "Profile Management",
        href: "/dashboard/profile",
        icon: <User className="w-5 h-5" />,
      },
      {
        label: "Security",
        href: "/dashboard/security",
        icon: <Shield className="w-5 h-5" />,
      },
      {
        label: "KYC Verification",
        href: "/dashboard/kyc",
        icon: <Shield className="w-5 h-5" />,
      },
      {
        label: "Notifications",
        href: "/dashboard/notifications",
        icon: <Bell className="w-5 h-5" />,
      },
    ]

    // Freelancer specific
    if (accountType === "FREELANCER") {
      baseItems.push(
        {
          label: "Job Listings",
          href: "/dashboard/freelancer/jobs",
          icon: <Briefcase className="w-5 h-5" />,
        },
        {
          label: "Badges",
          href: "/dashboard/freelancer/badges",
          icon: <Shield className="w-5 h-5" />,
        },
        {
          label: "Commissions",
          href: "/dashboard/freelancer/commissions",
          icon: <BarChart3 className="w-5 h-5" />,
        }
      )
    }

    // Entrepreneur specific
    if (accountType === "ENTREPRENEUR") {
      baseItems.push(
        {
          label: "Startups",
          href: "/dashboard/entrepreneur/startups",
          icon: <Building2 className="w-5 h-5" />,
        },
        {
          label: "Team",
          href: "/dashboard/entrepreneur/team",
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: "Reports",
          href: "/dashboard/entrepreneur/reports",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          label: "Investor Presentation",
          href: "/dashboard/entrepreneur/presentations",
          icon: <Presentation className="w-5 h-5" />,
        },
        {
          label: "Projects",
          href: "/dashboard/entrepreneur/projects",
          icon: <FolderKanban className="w-5 h-5" />,
          children: [
            {
              label: "All Projects",
              href: "/dashboard/entrepreneur/projects",
              icon: <FolderKanban className="w-4 h-4" />,
            },
            {
              label: "Create Project",
              href: "/dashboard/entrepreneur/projects/new",
              icon: <FolderKanban className="w-4 h-4" />,
            },
          ],
        }
      )
    }

    // Worker specific
    if (accountType === "WORKER") {
      baseItems.push(
        {
          label: "Tasks",
          href: "/dashboard/worker/tasks",
          icon: <Briefcase className="w-5 h-5" />,
        },
        {
          label: "Reports",
          href: "/dashboard/worker/reports",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          label: "Integrations",
          href: "/dashboard/worker/integrations",
          icon: <Zap className="w-5 h-5" />,
        },
        {
          label: "Integration Permissions",
          href: "/dashboard/worker/integration-permissions",
          icon: <Shield className="w-5 h-5" />,
        }
      )

      // Add company-related items if worker has company access
      if (userCompanies.length > 0) {
        userCompanies.forEach((company) => {
          const canCreateProject = hasPermission("TASK_ASSIGN") || hasPermission("REPORT_CREATE")
          const canAccessIntegrations = hasPermission("API_ACCESS")

          if (canCreateProject || canAccessIntegrations) {
            baseItems.push({
              label: company.name,
              href: `/dashboard/company/${company.id}`,
              icon: <Building2 className="w-5 h-5" />,
              children: [
                ...(canCreateProject ? [{
                  label: "Create Project",
                  href: `/dashboard/company/${company.id}/projects/new`,
                  icon: <FolderKanban className="w-4 h-4" />,
                }] : []),
                ...(canAccessIntegrations ? [{
                  label: "Integrations",
                  href: `/dashboard/company/${company.id}/integrations`,
                  icon: <Zap className="w-4 h-4" />,
                }] : []),
                {
                  label: "Employees",
                  href: `/dashboard/company/${company.id}/employees`,
                  icon: <Users className="w-4 h-4" />,
                },
                {
                  label: "Job Postings",
                  href: `/dashboard/company/${company.id}/jobs`,
                  icon: <Briefcase className="w-4 h-4" />,
                },
              ],
            })
          }
        })
      }
    }

    // Employer specific
    if (accountType === "EMPLOYER") {
      baseItems.push(
        {
          label: "Companies",
          href: "/dashboard/employer/companies",
          icon: <Building2 className="w-5 h-5" />,
          children: [
            {
              label: "My Companies",
              href: "/dashboard/employer/companies",
              icon: <Building2 className="w-4 h-4" />,
            },
            {
              label: "Create Company",
              href: "/dashboard/employer/company/create",
              icon: <Building2 className="w-4 h-4" />,
            },
          ],
        },
        {
          label: "Company Management",
          href: "/dashboard/employer/company",
          icon: <Settings className="w-5 h-5" />,
        },
        {
          label: "Employees",
          href: "/dashboard/employer/employees",
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: "Job Postings",
          href: "/dashboard/employer/jobs",
          icon: <Briefcase className="w-5 h-5" />,
          children: [
            {
              label: "All Jobs",
              href: "/dashboard/employer/jobs",
              icon: <Briefcase className="w-4 h-4" />,
            },
            {
              label: "Create Job",
              href: "/dashboard/employer/jobs/new",
              icon: <Briefcase className="w-4 h-4" />,
            },
          ],
        },
        {
          label: "Projects",
          href: "/dashboard/employer/projects",
          icon: <FolderKanban className="w-5 h-5" />,
          children: [
            {
              label: "All Projects",
              href: "/dashboard/employer/projects",
              icon: <FolderKanban className="w-4 h-4" />,
            },
            {
              label: "Create Project",
              href: "/dashboard/employer/projects/new",
              icon: <FolderKanban className="w-4 h-4" />,
            },
          ],
        },
        {
          label: "Advertising",
          href: "/dashboard/employer/advertising",
          icon: <Megaphone className="w-5 h-5" />,
        },
        {
          label: "Integrations",
          href: "/dashboard/employer/integrations",
          icon: <Zap className="w-5 h-5" />,
        },
        {
          label: "Integration Permissions",
          href: "/dashboard/employer/integration-permissions",
          icon: <Shield className="w-5 h-5" />,
        },
        {
          label: "Reports",
          href: "/dashboard/employer/reports",
          icon: <FileText className="w-5 h-5" />,
        }
      )
    }

    // Investor specific
    if (accountType === "INVESTOR") {
      baseItems.push(
        {
          label: "Investment Requests",
          href: "/dashboard/investor/requests",
          icon: <Briefcase className="w-5 h-5" />,
        },
        {
          label: "Reports",
          href: "/dashboard/investor/reports",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          label: "Presentations",
          href: "/dashboard/investor/presentations",
          icon: <Presentation className="w-5 h-5" />,
        }
      )
    }

    return baseItems
  }

  const menuItems = getMenuItems()

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/")
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.href}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.href)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg transition",
                      isActive(item.href)
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedItems.includes(item.href) && "rotate-90"
                      )}
                    />
                  </button>
                  {expandedItems.includes(item.href) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm",
                            isActive(child.href)
                              ? "bg-primary-50 text-primary-700 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {child.icon}
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition",
                    isActive(item.href)
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}

