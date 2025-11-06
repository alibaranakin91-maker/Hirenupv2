"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Logo } from "@/components/ui/logo";
import { SearchBar } from "@/components/ui/search-bar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Connect, Collaborate, and Grow
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The all-in-one platform for professionals, companies, and freelancers to connect and achieve their goals.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <SearchBar
            onSearch={(query) => {
              // Handle search
              console.log("Search:", query)
            }}
            onFilterChange={(filter, value) => {
              // Handle filter change
              console.log("Filter:", filter, value)
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/auth/signup">
            <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/freelancers">
            <Button size="lg" variant="outline" className="px-8">
              Find Talent
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { 
              title: "For Freelancers", 
              desc: "Find projects, build your portfolio, and grow your career",
              icon: "💼",
              link: "/freelancers"
            },
            { 
              title: "For Companies", 
              desc: "Manage your team, find talent, and scale your business",
              icon: "🏢",
              link: "/companies"
            },
            { 
              title: "For Entrepreneurs", 
              desc: "Launch projects, build teams, and attract investors",
              icon: "🚀",
              link: "/projects"
            },
          ].map((feature, i) => (
            <Link key={i} href={feature.link}>
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Account Types - More Refined */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Choose Your Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { 
                name: "Freelancer", 
                desc: "Work independently",
                color: "bg-blue-50 border-blue-200 text-blue-700",
                icon: "💼"
              },
              { 
                name: "Entrepreneur", 
                desc: "Build your startup",
                color: "bg-purple-50 border-purple-200 text-purple-700",
                icon: "🚀"
              },
              { 
                name: "Worker", 
                desc: "Join a team",
                color: "bg-green-50 border-green-200 text-green-700",
                icon: "👷"
              },
              { 
                name: "Employer", 
                desc: "Hire and manage",
                color: "bg-orange-50 border-orange-200 text-orange-700",
                icon: "🏢"
              },
              { 
                name: "Investor", 
                desc: "Find opportunities",
                color: "bg-red-50 border-red-200 text-red-700",
                icon: "💰"
              },
            ].map((type, i) => (
              <Link key={i} href="/auth/signup">
                <div className={`bg-white rounded-lg p-5 border-2 ${type.color} hover:shadow-md transition-all cursor-pointer text-center`}>
                  <div className="text-3xl mb-3">{type.icon}</div>
                  <h3 className="font-semibold mb-1">{type.name}</h3>
                  <p className="text-sm opacity-80">{type.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">5K+</div>
              <div className="text-gray-600">Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">2K+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Jobs Posted</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* General */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">General</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth/signup" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/developers" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Developers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Browse Hirenup */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Browse Hirenup</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/learning" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Learning
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/mobile" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Mobile
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Products
                  </Link>
                </li>
              </ul>
            </div>

            {/* Business Solutions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Business Solutions</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/talent" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Talent
                  </Link>
                </li>
                <li>
                  <Link href="/marketing" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Marketing
                  </Link>
                </li>
                <li>
                  <Link href="/sales" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Sales
                  </Link>
                </li>
                <li>
                  <Link href="/advertising" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Advertising
                  </Link>
                </li>
              </ul>
            </div>

            {/* Directories */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Directories</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/members" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Members
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Companies
                  </Link>
                </li>
                <li>
                  <Link href="/freelancers" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Freelancers
                  </Link>
                </li>
                <li>
                  <Link href="/posts" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Posts
                  </Link>
                </li>
                <li>
                  <Link href="/articles" className="text-gray-600 hover:text-primary-600 transition text-sm">
                    Articles
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <Logo size="sm" />
                <span className="text-gray-600 text-sm">&copy; 2024</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <Link href="/about" className="hover:text-primary-600 transition">
                  About
                </Link>
                <Link href="/contact" className="hover:text-primary-600 transition">
                  Contact
                </Link>
                <Link href="/privacy" className="hover:text-primary-600 transition">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-primary-600 transition">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-primary-600 transition">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
