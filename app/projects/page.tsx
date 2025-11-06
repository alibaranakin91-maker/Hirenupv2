import { Header } from "@/components/layout/header"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Projects</h1>
        <p className="text-gray-600">Browse and discover projects from entrepreneurs and companies.</p>
      </div>
    </div>
  )
}

