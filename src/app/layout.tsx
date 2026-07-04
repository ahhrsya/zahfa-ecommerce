import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { prisma } from "@/lib/prisma"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "Zahfa - Busana Muslimah Modern",
  description:
    "Zahfa adalah destinasi busana muslimah modern dengan koleksi pakaian syar'i terkini. Temukan gamis, hijab, dan aksesoris muslimah terbaik.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let categories: { id: string; name: string; slug: string }[] = []
  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true },
    })
  } catch {} // graceful fallback for build time

  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white font-body text-stone-800">
        <Header categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
