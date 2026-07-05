import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FloatingWhatsapp from "@/components/FloatingWhatsapp"
import AdminGuard from "@/components/AdminGuard"
import { prisma } from "@/lib/prisma"
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SITE_URL } from "@/lib/site"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "fashion wanita",
    "gamis modern",
    "hijab",
    "dress wanita",
    "pakaian wanita modern",
    "fashion Indonesia",
    "toko baju online",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let categories: { id: string; name: string; slug: string }[] = []
  let waNumber = "6281234567890"
  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true },
    })
    const setting = await prisma.setting.findUnique({ where: { key: "WA_NUMBER" } })
    if (setting?.value) waNumber = setting.value
  } catch {} // graceful fallback for build time

  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <Script id="gtm-script" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K8DSDQMB')`}
      </Script>
      <body className="min-h-full flex flex-col bg-white font-body text-stone-800">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K8DSDQMB"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AdminGuard>
          <Header categories={categories} />
        </AdminGuard>
        <main className="flex-1">{children}</main>
        <AdminGuard>
          <Footer />
        </AdminGuard>
        <AdminGuard>
          <FloatingWhatsapp waNumber={waNumber} />
        </AdminGuard>
      </body>
    </html>
  )
}
