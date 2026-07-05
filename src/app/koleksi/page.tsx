import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"
import { SITE_NAME, SITE_URL } from "@/lib/site"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Koleksi",
  description: `Jelajahi koleksi pilihan ${SITE_NAME}. Temukan berbagai koleksi fashion wanita modern pilihan untuk tampilan terbaik Anda.`,
  alternates: { canonical: "/koleksi" },
  openGraph: {
    url: "/koleksi",
    title: `Koleksi | ${SITE_NAME}`,
    description: `Jelajahi koleksi pilihan ${SITE_NAME}.`,
  },
}

export default async function KoleksiPage() {
  const [featuredProducts, latestProducts, banners] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: true,
      },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: true,
      },
    }),
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ])

  const collections = [
    {
      title: "Koleksi Terbaru",
      subtitle: "Produk terbaru yang baru saja tiba di Zahfa",
      products: latestProducts,
    },
    {
      title: "Koleksi Pilihan",
      subtitle: "Rekomendasi produk terbaik untuk Anda",
      products: featuredProducts,
    },
  ]

  return (
    <div>
      {/* Hero Banner */}
      {banners.length > 0 && (
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <Image
            src={banners[0].image}
            alt={banners[0].title || "Zahfa Collection"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="max-w-7xl mx-auto">
              <p className="text-white/70 text-sm uppercase tracking-widest mb-2">Koleksi</p>
              <h1 className="text-4xl md:text-6xl text-white font-bold mb-3">
                {banners[0].title || "Koleksi Zahfa"}
              </h1>
              {banners[0].subtitle && (
                <p className="text-white/80 text-lg max-w-xl">{banners[0].subtitle}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {!banners.length && (
        <section className="py-20 md:py-28 bg-gradient-to-br from-stone-800 to-stone-700 text-white text-center px-4">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-3">Koleksi</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Koleksi Zahfa</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Jelajahi berbagai koleksi fashion wanita modern pilihan kami
          </p>
        </section>
      )}

      {/* Collections */}
      {collections.map((collection, idx) => (
        collection.products.length > 0 && (
          <section key={idx} className={`py-16 ${idx % 2 === 1 ? "bg-stone-50/50" : ""}`}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl text-stone-700">{collection.title}</h2>
                <p className="text-stone-400 mt-2 text-sm">{collection.subtitle}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                {collection.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link
                  href="/products"
                  className="inline-block px-8 py-3 border border-stone-300 text-stone-600 text-sm uppercase tracking-widest hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
                >
                  Lihat Semua Produk
                </Link>
              </div>
            </div>
          </section>
        )
      ))}

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-stone-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-white mb-4">Dapatkan Tampilan Terbaikmu</h2>
          <p className="text-stone-400 mb-8 text-base">
            Jelajahi koleksi lengkap fashion wanita modern Zahfa. Dapatkan diskon 20% untuk pembelian pertama!
          </p>
          <Link
            href="/products"
            className="inline-block px-10 py-3 bg-white text-stone-900 text-sm uppercase tracking-widest font-medium hover:bg-stone-100 transition-colors"
          >
            Belanja Sekarang
          </Link>
        </div>
      </section>
    </div>
  )
}
