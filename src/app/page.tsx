import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"
import HeroSlider from "@/components/HeroSlider"
import DragScrollCarousel from "@/components/DragScrollCarousel"
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SITE_URL } from "@/lib/site"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `${SITE_NAME} - ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
}

export default async function HomePage() {
  const [categories, latestProducts, featuredProducts, banners] = await Promise.all([
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
      take: 12,
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

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider banners={banners} />

      {/* Kategori Populer — Carousel */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 text-center mb-10">
          <h2 className="text-2xl md:text-3xl text-stone-700">Kategori Populer</h2>
          <p className="text-stone-400 mt-2 text-sm">Temukan koleksi fashion wanita sesuai kebutuhan Anda</p>
        </div>
        <DragScrollCarousel gap={16}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative shrink-0 overflow-hidden transition-transform duration-300 hover:-translate-y-1"
              style={{ scrollSnapAlign: "start", width: 200, aspectRatio: "3 / 4" }}
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="200px"
                />
              ) : (
                <div className="absolute inset-0 bg-stone-200 flex items-center justify-center">
                  <svg className="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-lg font-semibold tracking-wide">{cat.name}</h3>
                <p className="text-white/70 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Lihat koleksi &rarr;
                </p>
              </div>
            </Link>
          ))}
        </DragScrollCarousel>
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
              <ProductCard key={product.id} product={product} isNew />
            ))}
          </div>
        </div>
      </section>

      {/* Produk Terpopuler */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl text-stone-700">Produk Terpopuler</h2>
              <p className="text-stone-400 mt-1.5 text-sm">Pilihan terbaik yang banyak diminati</p>
            </div>
            <DragScrollCarousel gap={20}>
              {featuredProducts.map((product) => (
                <div key={product.id} className="snap-start w-[75vw] sm:w-[280px] md:w-[300px] lg:w-[320px] shrink-0">
                  <ProductCard product={product} isBest />
                </div>
              ))}
            </DragScrollCarousel>
          </div>
        </section>
      )}

      {/* Banner Promo */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto relative rounded-sm overflow-hidden bg-gradient-to-r from-stone-800 to-stone-700 aspect-[4/3] md:aspect-[21/7] flex items-center">
          <div className="relative z-10 px-6 md:px-16 text-white">
            <p className="text-xs uppercase tracking-widest text-stone-300 mb-2">Koleksi Spesial</p>
            <h2 className="text-2xl md:text-5xl text-white mb-3">Koleksi Ramadan</h2>
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

      {/* Owner Message */}
      <section className="py-16 px-6 bg-stone-900/5 border-t border-stone-200">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl text-stone-700 mb-4">Pesan dari Owner</h2>
          <div className="space-y-4 text-stone-500 leading-relaxed text-sm md:text-base">
            <p>
              Assalamu&apos;alaikum, selamat datang di <strong>Zahfa</strong>!
            </p>
            <p>
              Saat ini website kami baru saja <strong>launching</strong> dan masih dalam tahap pengembangan.
              Mohon maaf jika masih ada kekurangan, kami sedang bekerja keras untuk memberikan pengalaman
              belanja terbaik untuk kamu.
            </p>
            <p>
              Untuk sementara, proses <strong>checkout</strong> akan diarahkan melalui <strong>WhatsApp</strong>
              , jadi kamu bisa langsung konsultasi dan konfirmasi pesanan dengan tim kami.
            </p>
            <p className="text-stone-700 font-semibold text-base">
              Sebagai ucapan terima kasih, nikmati <span className="text-amber-600">diskon 20%</span> untuk
              semua produk selama masa launching! 🎉
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Zahfa%2C%20saya%20mau%20order%20produk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-medium uppercase tracking-wider transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Belanja via WhatsApp
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3 border border-stone-300 text-stone-600 text-sm uppercase tracking-wider hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
            >
              Lihat Produk
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: SITE_NAME,
                url: SITE_URL,
                logo: `${SITE_URL}/uploads/banners/brand1.png`,
                sameAs: [
                  "https://instagram.com/zahfa.store",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "Customer Service",
                  availableLanguage: "Indonesian",
                },
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: SITE_NAME,
                publisher: { "@id": `${SITE_URL}/#organization` },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@type": "WebPage",
                "@id": `${SITE_URL}/#webpage`,
                url: SITE_URL,
                name: `${SITE_NAME} - ${SITE_TAGLINE}`,
                description: SITE_DESCRIPTION,
                isPartOf: { "@id": `${SITE_URL}/#website` },
                about: { "@id": `${SITE_URL}/#organization` },
              },
            ],
          }),
        }}
      />
    </div>
  )
}
