"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Eye, MousePointerClick } from "lucide-react"
import Link from "next/link"

export default function AdvertisingPage() {
  const [campaigns] = useState([
    {
      id: "1",
      name: "Summer Campaign",
      status: "active",
      budget: 5000,
      spent: 3200,
      impressions: 125000,
      clicks: 3200,
      ctr: 2.56,
    },
  ])

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Advertising Management</h1>
          <Link href="/dashboard/employer/advertising/new">
            <Button className="bg-primary-500 hover:bg-primary-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Total Budget</div>
            <div className="text-2xl font-bold text-gray-900">₺5,000</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Total Spent</div>
            <div className="text-2xl font-bold text-gray-900">₺3,200</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Impressions</div>
            <div className="text-2xl font-bold text-gray-900">125K</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Clicks</div>
            <div className="text-2xl font-bold text-gray-900">3,200</div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Campaigns</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      campaign.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <Link href={`/dashboard/employer/advertising/${campaign.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Budget</div>
                    <div className="font-semibold text-gray-900">₺{campaign.budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Spent</div>
                    <div className="font-semibold text-gray-900">₺{campaign.spent.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Impressions</div>
                    <div className="font-semibold text-gray-900">{campaign.impressions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">CTR</div>
                    <div className="font-semibold text-gray-900">{campaign.ctr}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

