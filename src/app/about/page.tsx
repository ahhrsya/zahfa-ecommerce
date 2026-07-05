import type { Metadata } from "next"
import { Heart, Shield, Star, Truck } from "lucide-react"
import { SITE_NAME } from "@/lib/site"

export const metadata: Metadata = {
  title: "Tentang Kami",
    description: `Kenali ${SITE_NAME}, destinasi fashion wanita modern Indonesia yang menghadirkan gamis, hijab, dan pakaian wanita berkualitas.`,
  alternates: { canonical: "/about" },
  openGraph: {
    url: "/about",
    title: `Tentang Kami | ${SITE_NAME}`,
  description: `Kenali ${SITE_NAME}, destinasi fashion wanita modern Indonesia yang menghadirkan gamis, hijab, dan pakaian wanita berkualitas.`,
  },
}

const values = [
  {
    icon: Heart,
    title: "Cinta & Kasih Sayang",
    desc: "Setiap produk dipilih dengan penuh cinta untuk memberikan yang terbaik bagi pelanggan.",
  },
  {
    icon: Shield,
    title: "Kualitas Terjamin",
    desc: "Kami hanya menghadirkan produk dengan kualitas terbaik yang nyaman dipakai sehari-hari.",
  },
  {
    icon: Star,
    title: "Modern & Syar'i",
    desc: "Mengusung gaya modern dengan desain yang elegan dan tetap sopan dalam berbusana.",
  },
  {
    icon: Truck,
    title: "Pengiriman Cepat",
    desc: "Komitmen kami untuk mengirimkan pesanan Anda dengan cepat dan aman.",
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-amber-600 to-amber-700 text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Zahfa</h1>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Berawal dari kecintaan terhadap fashion wanita modern, Zahfa hadir untuk
          memenuhi kebutuhan gaya wanita Indonesia yang ingin tampil anggun dan percaya diri.
        </p>
      </section>

      {/* About Story */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">Cerita Kami</h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                Zahfa lahir pada tahun 2020 dari sebuah visi sederhana: menyediakan fashion wanita
                yang tidak hanya menutup aurat, tetapi juga membuat setiap wanita merasa percaya diri
                dan cantok.
              </p>
              <p>
                Berawal dari toko kecil di rumah, kini Zahfa telah berkembang menjadi salah satu
                destinasi belanja fashion wanita modern yang dipercaya oleh ribuan pelanggan di
                seluruh Indonesia.
              </p>
              <p>
                Setiap koleksi yang kami hadirkan melalui proses kurasi yang ketat untuk memastikan
                kualitas bahan, kenyamanan, dan tentunya gaya yang elegan dan modern.
              </p>
            </div>
          </div>
          <div className="bg-amber-100 rounded-2xl aspect-square flex items-center justify-center">
            <svg className="w-32 h-32 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-4">Gallery</h2>
          <p className="text-stone-400 text-sm text-center mb-12">Momen dan koleksi terbaik dari Zahfa</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: "Koleksi Gamis", color: "from-amber-200 to-amber-300" },
              { label: "Koleksi Hijab", color: "from-amber-300 to-amber-400" },
              { label: "Koleksi Dress", color: "from-stone-300 to-stone-400" },
              { label: "Koleksi Atasan", color: "from-amber-100 to-amber-200" },
              { label: "Koleksi Rok", color: "from-stone-200 to-stone-300" },
              { label: "Koleksi Mukena", color: "from-amber-200 to-stone-200" },
              { label: "Koleksi Aksesoris", color: "from-amber-300 to-stone-300" },
              { label: "Koleksi Spesial", color: "from-stone-300 to-amber-200" },
            ].map((item, i) => (
              <div
                key={i}
                className={`relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br ${item.color} group cursor-pointer`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nilai-nilai */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-12">Nilai-nilai Kami</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => {
            const Icon = v.icon
            return (
              <div key={v.title} className="text-center p-6 rounded-xl border border-amber-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">{v.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{v.desc}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
