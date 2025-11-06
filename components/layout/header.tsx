"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Header() {
  const [showMembershipMenu, setShowMembershipMenu] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center">
            <Logo size="md" />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Home
            </Link>
            <Link href="/projects" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Projects
            </Link>
            <Link href="/freelancers" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Freelancers
            </Link>
            <Link href="/companies" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Companies
            </Link>
            <Link href="/jobs" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Jobs
            </Link>
            <div 
              className="relative"
              onMouseEnter={() => setShowMembershipMenu(true)}
              onMouseLeave={() => setShowMembershipMenu(false)}
            >
              <button className="text-gray-700 hover:text-primary-600 transition font-medium flex items-center gap-1">
                Membership Types
                <ChevronDown className="w-4 h-4" />
              </button>
              {showMembershipMenu && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                    For Freelancers
                  </div>
                  <Link href="/auth/signup?type=freelancer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Freelancer
                  </Link>
                  <Link href="/auth/signup?type=worker" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Worker
                  </Link>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 mt-2">
                    For Companies
                  </div>
                  <Link href="/auth/signup?type=employer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Employer
                  </Link>
                  <Link href="/auth/signup?type=entrepreneur" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Entrepreneur
                  </Link>
                  <Link href="/auth/signup?type=investor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Investor
                  </Link>
                </div>
              )}
            </div>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Sign In
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary-500 hover:bg-primary-600 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
