"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Building2, CheckCircle, Clock, XCircle, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

export default function CompanyManagementPage() {
  const { data: session } = useSession()
  const [companies, setCompanies] = useState<any[]>([])

  useEffect(() => {
    const fetchCompanies = async () => {
      const response = await fetch("/api/companies/my-companies")
      if (response.ok) {
        const data = await response.json()
        setCompanies(data.companies || [])
      }
    }
    if (session) {
      fetchCompanies()
    }
  }, [session])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "Verified"
      case "PENDING":
        return "Pending Verification"
      case "REJECTED":
        return "Rejected"
      default:
        return "Unknown"
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
          <Link href="/dashboard/employer/company/create">
            <Button className="bg-primary-500 hover:bg-primary-600 text-white">
              <Building2 className="w-4 h-4 mr-2" />
              Register New Company
            </Button>
          </Link>
        </div>

        {companies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Companies Registered</h2>
            <p className="text-gray-600 mb-6">
              Register your company to start managing employees, posting jobs, and creating projects.
            </p>
            <Link href="/dashboard/employer/company/create">
              <Button className="bg-primary-500 hover:bg-primary-600 text-white">
                Register Company
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map((company) => (
              <div key={company.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-turquoise-400 to-primary-500 flex items-center justify-center text-white font-bold text-lg">
                      {company.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-600">{company.industry || "No industry"}</p>
                    </div>
                  </div>
                  {getStatusIcon(company.verificationStatus)}
                </div>

                <div className="mb-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    company.verificationStatus === "VERIFIED"
                      ? "bg-green-100 text-green-800"
                      : company.verificationStatus === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {getStatusIcon(company.verificationStatus)}
                    {getStatusText(company.verificationStatus)}
                  </div>
                </div>

                {company.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{company.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2 text-gray-900">{company.location || "Not set"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Size:</span>
                    <span className="ml-2 text-gray-900">{company.size || "Not set"}</span>
                  </div>
                  {company.website && (
                    <div className="col-span-2 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-gray-400" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Link href={`/dashboard/employer/company/${company.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">Manage</Button>
                  </Link>
                  <Link href={`/dashboard/employer/company/${company.id}/employees`} className="flex-1">
                    <Button variant="outline" className="w-full">Employees</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

