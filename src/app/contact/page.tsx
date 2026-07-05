export const dynamic = 'force-dynamic'

import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { SITE_NAME } from "@/lib/site"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: `Hubungi tim ${SITE_NAME} untuk pertanyaan, bantuan, atau kerja sama. Kami siap membantu kebutuhan fashion Anda.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "/contact",
    title: `Hubungi Kami | ${SITE_NAME}`,
    description: `Hubungi tim ${SITE_NAME} untuk pertanyaan, bantuan, atau kerja sama.`,
  },
}

export default async function ContactPage() {
  const [waNumber, storeAddress, storeEmail] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "WA_NUMBER" } }).then((s) => s?.value || "6281234567890"),
    prisma.setting.findUnique({ where: { key: "STORE_ADDRESS" } }).then(
      (s) => s?.value || "Jl. Muslimah No. 123, Jakarta Selatan, Indonesia"
    ),
    prisma.setting.findUnique({ where: { key: "STORE_EMAIL" } }).then(
      (s) => s?.value || "hello@zahfa.com"
    ),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-amber-600 to-amber-700 text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
        <p className="text-lg text-white/80 max-w-xl mx-auto">
          Punya pertanyaan atau butuh bantuan? Tim Zahfa siap membantu Anda.
        </p>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Kirim Pesan</h2>
            <ContactForm />
          </div>

          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Informasi Toko</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800">Alamat</h3>
                  <p className="text-sm text-stone-500 mt-1">{storeAddress}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800">Email</h3>
                  <p className="text-sm text-stone-500 mt-1">{storeEmail}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800">WhatsApp</h3>
                  <p className="text-sm text-stone-500 mt-1">+{waNumber}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800">Jam Operasional</h3>
                  <p className="text-sm text-stone-500 mt-1">Senin - Jumat: 08:00 - 17:00</p>
                  <p className="text-sm text-stone-500">Sabtu: 08:00 - 14:00</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 rounded-xl bg-amber-50 border border-amber-100 aspect-[4/3] flex items-center justify-center">
              <div className="text-center text-stone-400">
                <MapPin className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm">Peta Lokasi</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
