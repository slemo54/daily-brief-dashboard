import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Anselmo's Dashboard - Daily Brief",
  description: "AI-powered personal dashboard for Anselmo Acquah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#0a0a0a] text-[#ebebeb]`}>
        <div className="flex min-h-screen bg-[#0a0a0a]">
          {/* Sidebar - Desktop */}
          <Sidebar />
          
          {/* Main Content */}
          <main className="flex-1 lg:ml-20 pb-20 lg:pb-0 bg-[#0a0a0a]">
            {children}
          </main>
        </div>
        
        {/* Bottom Navigation - Mobile */}
        <BottomNav />
      </body>
    </html>
  );
}
