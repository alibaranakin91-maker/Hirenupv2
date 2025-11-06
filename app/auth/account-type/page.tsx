"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AccountType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"

const accountTypes = [
  {
    type: "FREELANCER" as AccountType,
    title: "Freelancer",
    icon: "💼",
    description: "Work independently, take on projects, get rated, and earn badges",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    features: ["Apply to jobs", "Get rated and earn badges", "VetTek feature", "Show work hours"],
  },
  {
    type: "ENTREPRENEUR" as AccountType,
    title: "Entrepreneur",
    icon: "🚀",
    description: "Launch startups, build teams, raise investment, and grow your company",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    features: ["Create startup", "Build team", "Create investment request", "Reporting and AI support"],
  },
  {
    type: "WORKER" as AccountType,
    title: "Worker",
    icon: "👷",
    description: "Complete tasks, report progress, and request API access",
    color: "bg-green-50 border-green-200 text-green-700",
    features: ["View tasks", "Create reports", "Request API access", "Earn badges"],
  },
  {
    type: "EMPLOYER" as AccountType,
    title: "Employer",
    icon: "🏢",
    description: "Post jobs, manage employees, assign permissions, and build your team",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    features: ["Create job postings", "Manage employees", "Assign permissions", "Manage company"],
  },
  {
    type: "INVESTOR" as AccountType,
    title: "Investor",
    icon: "💰",
    description: "Make investments, review reports, and view presentations",
    color: "bg-red-50 border-red-200 text-red-700",
    features: ["View investment requests", "Review reports", "Receive presentations", "Make investments"],
  },
]

export default function AccountTypePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<AccountType | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selectedType || !session?.user?.id) return

    setLoading(true)
    try {
      const response = await fetch("/api/auth/set-account-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountType: selectedType }),
      })

      if (response.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error setting account type:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Account Type
          </h1>
          <p className="text-xl text-gray-600">
            Select your role on Hirenup. You can change this later if needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {accountTypes.map((account) => (
            <button
              key={account.type}
              onClick={() => setSelectedType(account.type)}
              className={`bg-white rounded-lg p-6 border-2 transition-all text-left ${
                selectedType === account.type
                  ? "border-primary-500 ring-4 ring-primary-100 shadow-lg"
                  : `border-gray-200 hover:border-primary-300 ${account.color}`
              }`}
            >
              <div className="text-4xl mb-4">{account.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{account.title}</h3>
              <p className="text-gray-600 mb-4">{account.description}</p>
              <ul className="space-y-2">
                {account.features.map((feature, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-primary-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={!selectedType || loading}
            size="lg"
            className="bg-primary-500 hover:bg-primary-600 text-white px-12"
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}
