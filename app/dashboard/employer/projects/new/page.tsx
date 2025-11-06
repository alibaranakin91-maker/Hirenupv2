"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AIChat } from "@/components/ai/ai-chat"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function NewCompanyProjectPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    budget: "",
    industry: "",
    timeline: "",
    requirements: "",
  })
  const [projectId, setProjectId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCreateProject = async () => {
    if (!projectData.name || !projectData.description) {
      alert("Lütfen en azından proje adı ve açıklamasını doldurun.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectData,
          budget: projectData.budget ? parseFloat(projectData.budget) : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setProjectId(data.project.id)
        alert("Proje oluşturuldu! AI asistanı ile devam edebilirsiniz.")
      } else {
        alert("Hata: " + (data.error || "Proje oluşturulamadı"))
      }
    } catch (error) {
      console.error("Error creating project:", error)
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-turquoise-50 via-white to-primary-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/employer/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri
              </Button>
            </Link>
            <Link href="/dashboard">
              <Logo size="sm" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-turquoise-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-turquoise-600 to-primary-600 bg-clip-text text-transparent">
              Yeni Şirket Projesi Oluştur
            </h1>
          </div>
          <p className="text-gray-600">
            AI asistanımız size proje planlaması, bütçe ve ekip kurma konusunda yardımcı olacak
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Proje Bilgileri</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proje Adı *
                </label>
                <input
                  type="text"
                  value={projectData.name}
                  onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-turquoise-500"
                  placeholder="Örn: Yeni Ürün Geliştirme"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proje Açıklaması *
                </label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-turquoise-500"
                  rows={4}
                  placeholder="Projenizin detaylarını açıklayın..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bütçe (₺)
                  </label>
                  <input
                    type="number"
                    value={projectData.budget}
                    onChange={(e) => setProjectData({ ...projectData, budget: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-turquoise-500"
                    placeholder="200000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endüstri
                  </label>
                  <input
                    type="text"
                    value={projectData.industry}
                    onChange={(e) => setProjectData({ ...projectData, industry: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-turquoise-500"
                    placeholder="Örn: Teknoloji, Finans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahmini Süre
                </label>
                <input
                  type="text"
                  value={projectData.timeline}
                  onChange={(e) => setProjectData({ ...projectData, timeline: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-turquoise-500"
                  placeholder="Örn: 6 ay, 1 yıl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gereksinimler
                </label>
                <textarea
                  value={projectData.requirements}
                  onChange={(e) => setProjectData({ ...projectData, requirements: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-turquoise-500"
                  rows={3}
                  placeholder="Teknik gereksinimler, özellikler vb..."
                />
              </div>

              <Button
                onClick={handleCreateProject}
                disabled={loading || !projectData.name || !projectData.description}
                className="w-full bg-gradient-to-r from-turquoise-500 to-primary-500 hover:from-turquoise-600 hover:to-primary-600"
                size="lg"
              >
                {loading ? "Oluşturuluyor..." : "Projeyi Oluştur"}
              </Button>
            </div>
          </div>

          {/* AI Chat */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="h-[600px]">
              {projectId ? (
                <AIChat
                  projectId={projectId}
                  userId={session.user.id}
                  context={{
                    projectName: projectData.name,
                    budget: projectData.budget,
                    industry: projectData.industry,
                    type: "company",
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-center text-gray-500">
                  <div>
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-turquoise-400" />
                    <p className="text-lg font-semibold mb-2">
                      AI Asistanına Erişmek İçin
                    </p>
                    <p className="text-sm">
                      Önce proje bilgilerini doldurup projeyi oluşturun.
                      <br />
                      Ardından AI asistanı size yardımcı olacak!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

