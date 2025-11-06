"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardSidebar } from "./sidebar"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { Bell, Settings, User } from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center">
              <Logo size="sm" />
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/notifications"
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              <Link
                href="/dashboard/profile"
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard/settings"
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{session.user.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-turquoise-400 to-primary-500 flex items-center justify-center text-white font-semibold">
                  {(session.user.name || session.user.email || "U")[0].toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

