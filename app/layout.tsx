import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HireNUp - Connect, Collaborate, and Grow",
  description: "Connect professionals, manage companies, find freelancers, and grow your business",
  keywords: ["freelance", "jobs", "companies", "projects", "hirenup"],
  authors: [{ name: "HireNUp" }],
  openGraph: {
    title: "HireNUp - Connect, Collaborate, and Grow",
    description: "Connect professionals, manage companies, find freelancers, and grow your business",
    url: "https://www.hirenup.com",
    siteName: "HireNUp",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireNUp - Connect, Collaborate, and Grow",
    description: "Connect professionals, manage companies, find freelancers, and grow your business",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.hirenup.com",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
