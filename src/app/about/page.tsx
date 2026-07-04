import type { Metadata } from "next"
import { Target, Eye, Heart, Shield, Star, Truck } from "lucide-react"
import { SITE_NAME } from "@/lib/site"

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: `Kenali ${SITE_NAME}, toko busana muslimah modern Indonesia yang menghadirkan gamis, hijab, dan pakaian syar'i berkualitas.`,
  alternates: { canonical: "/about" },
  openGraph: {
    url: "/about",
    title: `Tentang Kami | ${SITE_NAME}`,
    description: `Kenali ${SITE_NAME}, toko busana muslimah modern Indonesia yang menghadirkan gamis, hijab, dan pakaian syar'i berkualitas.`,
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
    desc: "Mengusung gaya modern tanpa meninggalkan prinsip syar'i dalam berbusana.",
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
          Berawal dari kecintaan terhadap busana muslimah modern, Zahfa hadir untuk
          memenuhi kebutuhan fashion wanita Indonesia yang ingin tampil anggun dan syar&apos;i.
        </p>
      </section>

      {/* About Story */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">Cerita Kami</h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                Zahfa lahir pada tahun 2020 dari sebuah visi sederhana: menyediakan busana muslimah
                yang tidak hanya menutup aurat, tetapi juga membuat setiap wanita merasa percaya diri
                dan cantok.
              </p>
              <p>
                Berawal dari toko kecil di rumah, kini Zahfa telah berkembang menjadi salah satu
                destinasi belanja busana muslimah modern yang dipercaya oleh ribuan pelanggan di
                seluruh Indonesia.
              </p>
              <p>
                Setiap koleksi yang kami hadirkan melalui proses kurasi yang ketat untuk memastikan
                kualitas bahan, kenyamanan, dan tentunya tetap sesuai dengan nilai-nilai islami.
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

      {/* Visi & Misi */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-12">Visi &amp; Misi</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-amber-100">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-3">Visi</h3>
              <p className="text-stone-600 leading-relaxed">
                Menjadi brand busana muslimah modern terkemuka di Indonesia yang menginspirasi
                wanita untuk tampil percaya diri dengan gaya islami.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-amber-100">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-amber-700" />
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-3">Misi</h3>
              <ul className="text-stone-600 leading-relaxed space-y-2 list-disc list-inside">
                <li>Menyediakan produk busana muslimah berkualitas tinggi dengan harga terjangkau</li>
                <li>Menjadi inspirasi gaya berpakaian islami yang modern dan kekinian</li>
                <li>Memberikan pelayanan terbaik untuk kepuasan pelanggan</li>
                <li>Berkontribusi dalam perkembangan industri fashion muslim Indonesia</li>
              </ul>
            </div>
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
