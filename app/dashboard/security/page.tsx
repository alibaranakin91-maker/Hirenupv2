"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, XCircle, Download } from "lucide-react"
import dynamic from "next/dynamic"

const QRCode = dynamic(() => import("qrcode.react"), { ssr: false })

export default function SecurityPage() {
  const { data: session } = useSession()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorSetup, setTwoFactorSetup] = useState<any>(null)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setTwoFactorEnabled(session.user.twoFactorEnabled || false)
    }
  }, [session])

  const setup2FA = async () => {
    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
      })
      const data = await response.json()
      setTwoFactorSetup(data)
      setBackupCodes(data.backupCodes)
      setShowBackupCodes(true)
    } catch (error) {
      console.error("Error setting up 2FA:", error)
    }
  }

  const enable2FA = async (code: string) => {
    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: twoFactorSetup.secret,
          code,
        }),
      })
      if (response.ok) {
        setTwoFactorEnabled(true)
        setTwoFactorSetup(null)
      }
    } catch (error) {
      console.error("Error enabling 2FA:", error)
    }
  }

  const disable2FA = async () => {
    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "DELETE",
      })
      if (response.ok) {
        setTwoFactorEnabled(false)
      }
    } catch (error) {
      console.error("Error disabling 2FA:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Security Settings</h1>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            {twoFactorEnabled ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Enabled</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">Disabled</span>
              </div>
            )}
          </div>

          {!twoFactorEnabled ? (
            !twoFactorSetup ? (
              <Button
                onClick={setup2FA}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                Enable Two-Factor Authentication
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                  <div className="flex justify-center mb-4">
                    <QRCode value={twoFactorSetup.qrCode} size={200} />
                  </div>
                  <p className="text-xs text-gray-600 text-center mb-4">
                    Or enter this code manually: <code className="bg-white px-2 py-1 rounded">{twoFactorSetup.secret}</code>
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      maxLength={6}
                      onChange={(e) => {
                        if (e.target.value.length === 6) {
                          enable2FA(e.target.value)
                        }
                      }}
                    />
                  </div>
                </div>

                {showBackupCodes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-yellow-800 mb-2">
                      Save these backup codes in a safe place
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {backupCodes.map((code, index) => (
                        <code key={index} className="bg-white px-3 py-2 rounded text-sm font-mono">
                          {code}
                        </code>
                      ))}
                    </div>
                    <Button
                      onClick={() => {
                        const text = backupCodes.join("\n")
                        const blob = new Blob([text], { type: "text/plain" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = "backup-codes.txt"
                        a.click()
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Backup Codes
                    </Button>
                  </div>
                )}
              </div>
            )
          ) : (
            <Button
              onClick={disable2FA}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Disable Two-Factor Authentication
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

