import { Header } from "@/components/layout/header"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Contact Us</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Get in Touch</h2>
              <p className="text-gray-600 mb-4">
                Have a question or need help? We're here to assist you.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">support@hirenup.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Office</h2>
              <p className="text-gray-600">
                123 Business Street<br />
                San Francisco, CA 94105<br />
                United States
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

