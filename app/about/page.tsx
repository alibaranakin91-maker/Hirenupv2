import { Header } from "@/components/layout/header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">About Us</h1>
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 mb-6">
            Hirenup is the all-in-one professional platform that connects freelancers, entrepreneurs, companies, and investors.
          </p>
          <p className="text-gray-600 mb-4">
            Our mission is to create a comprehensive ecosystem where professionals can find opportunities, build teams, 
            manage projects, and grow their businesses all in one place.
          </p>
        </div>
      </div>
    </div>
  )
}

