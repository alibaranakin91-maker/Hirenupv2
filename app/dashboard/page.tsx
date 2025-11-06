"use client"

import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { data: session } = useSession()

  if (!session) return null

  const accountType = session.user.accountType

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome! Your account type: <span className="font-semibold">{accountType || "Not specified"}</span>
        </p>
      </div>

      {!accountType ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Account Type Not Selected</h2>
          <p className="text-yellow-700 mb-4">
            Please select your account type to continue.
          </p>
          <Link href="/auth/account-type">
            <Button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600">
              Select Account Type
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Overview</h2>
          <p className="text-gray-600">
            Use the sidebar menu to navigate to different sections of your dashboard.
          </p>
        </div>
      )}
    </DashboardLayout>
  )
}

