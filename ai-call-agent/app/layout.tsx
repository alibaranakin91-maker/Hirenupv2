import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "AI Call Agent - Akıllı Arama Asistanı",
  description: "CRM entegrasyonlu yapay zeka arama asistanı",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
