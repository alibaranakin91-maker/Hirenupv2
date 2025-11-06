"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle, Clock, XCircle, Camera, FileText } from "lucide-react"
import Link from "next/link"

export default function KYCPage() {
  const { data: session } = useSession()
  const [kycStatus, setKycStatus] = useState("NOT_STARTED")
  const [documents, setDocuments] = useState({
    front: null as File | null,
    back: null as File | null,
    selfie: null as File | null,
  })
  const [uploading, setUploading] = useState(false)
  const [documentType, setDocumentType] = useState("ID")

  useEffect(() => {
    // Fetch KYC status
    const fetchKYC = async () => {
      const response = await fetch("/api/kyc/status")
      if (response.ok) {
        const data = await response.json()
        setKycStatus(data.status || "NOT_STARTED")
      }
    }
    if (session) {
      fetchKYC()
    }
  }, [session])

  const handleFileChange = async (type: "front" | "back" | "selfie", file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const response = await fetch("/api/kyc/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setDocuments((prev) => ({ ...prev, [type]: file }))
      }
    } catch (error) {
      console.error("Error uploading document:", error)
    } finally {
      setUploading(false)
    }
  }

  const submitKYC = async () => {
    try {
      const response = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentType }),
      })

      if (response.ok) {
        setKycStatus("PENDING")
      }
    } catch (error) {
      console.error("Error submitting KYC:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case "PENDING":
        return <Clock className="w-6 h-6 text-yellow-600" />
      case "REJECTED":
        return <XCircle className="w-6 h-6 text-red-600" />
      default:
        return null
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
        return "Not Started"
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">KYC Verification</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Identity Verification</h2>
              <p className="text-gray-600">
                Verify your identity to access all platform features
              </p>
            </div>
            {getStatusIcon(kycStatus)}
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            kycStatus === "VERIFIED"
              ? "bg-green-100 text-green-800"
              : kycStatus === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : kycStatus === "REJECTED"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}>
            {getStatusIcon(kycStatus)}
            {getStatusText(kycStatus)}
          </div>

          {kycStatus === "NOT_STARTED" || kycStatus === "REJECTED" ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="ID">National ID</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="DRIVER_LICENSE">Driver License</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Document Front
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileChange("front", e.target.files[0])
                      }
                    }}
                    className="hidden"
                    id="front-upload"
                  />
                  <label
                    htmlFor="front-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary-500 transition"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Front</span>
                  </label>
                  {documents.front && (
                    <p className="text-xs text-green-600 mt-2">✓ Uploaded</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Document Back (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileChange("back", e.target.files[0])
                      }
                    }}
                    className="hidden"
                    id="back-upload"
                  />
                  <label
                    htmlFor="back-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary-500 transition"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Back</span>
                  </label>
                  {documents.back && (
                    <p className="text-xs text-green-600 mt-2">✓ Uploaded</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="w-4 h-4 inline mr-2" />
                  Selfie with Document
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileChange("selfie", e.target.files[0])
                    }
                  }}
                  className="hidden"
                  id="selfie-upload"
                />
                <label
                  htmlFor="selfie-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary-500 transition"
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Upload Selfie</span>
                </label>
                {documents.selfie && (
                  <p className="text-xs text-green-600 mt-2">✓ Uploaded</p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> Make sure your documents are clear and readable. 
                  Your face should be clearly visible in the selfie photo.
                </p>
              </div>

              <Button
                onClick={submitKYC}
                disabled={!documents.front || !documents.selfie || uploading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white"
              >
                {uploading ? "Uploading..." : "Submit for Verification"}
              </Button>
            </div>
          ) : kycStatus === "PENDING" ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Your KYC verification is pending. Our team is reviewing your documents. 
                You will be notified once the verification is complete.
              </p>
            </div>
          ) : kycStatus === "VERIFIED" ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                Your identity has been verified. You now have full access to all platform features.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  )
}

