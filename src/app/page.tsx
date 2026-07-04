import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { formatRupiah } from "@/lib/utils"
import ProductCard from "@/components/ProductCard"
import HeroSlider from "@/components/HeroSlider"

export default async function HomePage() {
  const [banners, categories, latestProducts, featuredProducts] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true, type: "hero" },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
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
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 4,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: true,
      },
    }),
  ])

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider banners={banners} />

      {/* Kategori Populer */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl text-stone-700">Kategori Populer</h2>
          <p className="text-stone-400 mt-2 text-sm">Temukan koleksi busana muslimah sesuai kebutuhan Anda</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-4 rounded-sm border border-stone-200 hover:border-stone-300 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                  <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium text-stone-500 group-hover:text-stone-700 transition-colors uppercase tracking-wider">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Produk Terbaru */}
      <section className="py-16 bg-stone-50/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl text-stone-700">Produk Terbaru</h2>
              <p className="text-stone-400 mt-1.5 text-sm">Koleksi terbaru yang baru saja tiba</p>
            </div>
            <Link
              href="/products"
              className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              Lihat Semua &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Produk Terpopuler */}
      {featuredProducts.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl text-stone-700">Produk Terpopuler</h2>
            <p className="text-stone-400 mt-1.5 text-sm">Pilihan terbaik yang banyak diminati</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Banner Promo */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto relative rounded-sm overflow-hidden bg-gradient-to-r from-stone-800 to-stone-700 aspect-[21/7] flex items-center">
          <div className="relative z-10 px-10 md:px-16 text-white">
            <p className="text-xs uppercase tracking-widest text-stone-300 mb-2">Koleksi Spesial</p>
            <h2 className="text-3xl md:text-5xl text-white mb-3">Koleksi Ramadan</h2>
            <p className="text-base md:text-lg text-stone-300 mb-5">Dapatkan diskon spesial hingga 50%</p>
            <Link
              href="/products"
              className="inline-block px-6 py-2.5 bg-white text-stone-800 font-medium text-sm tracking-wider uppercase hover:bg-stone-100 transition-colors"
            >
              Belanja Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl text-stone-700">Dapatkan Info Terbaru</h2>
          <p className="text-stone-400 mt-2 mb-8 text-sm">
            Berlangganan newsletter untuk mendapatkan promo dan koleksi terbaru dari Zahfa
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="flex-1 px-4 py-3 border border-stone-200 bg-transparent text-sm text-stone-600 placeholder-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-stone-800 text-white text-sm font-medium uppercase tracking-wider hover:bg-stone-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
