import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import { Chakra_Petch } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar, MobileNav } from "@/components/layout/Sidebar";
import { NationDataProvider } from "@/hooks/useNationData";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IncCalc - Cybernations Calculator",
  description: "Nation optimization calculator for Cybernations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${chakraPetch.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        {/* Top accent bar */}
        <div className="h-0.5 bg-[#B92432] shrink-0" aria-hidden="true" />
        <NationDataProvider>
          <div className="flex flex-1 min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <MobileNav />
              <main className="flex-1 p-4 md:p-6 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </NationDataProvider>
      </body>
    </html>
  );
}
