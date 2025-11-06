import { Header } from "@/components/layout/header"

export default function FreelancersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Freelancers</h1>
        <p className="text-gray-600">Find talented freelancers for your projects.</p>
      </div>
    </div>
  )
}

