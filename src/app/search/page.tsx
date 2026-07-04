import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"
import { SITE_NAME } from "@/lib/site"

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
  title: "Cari Produk",
  description: `Cari produk busana muslimah favorit Anda di ${SITE_NAME}. Temukan gamis, hijab, dan dress syar'i terbaru.`,
  alternates: { canonical: "/search" },
  robots: {
    index: false,
    follow: true,
  },
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams
  const query =
    typeof sp.q === "string" ? sp.q.trim() : ""

  const products = query
    ? await prisma.product.findMany({
        where: {
          isActive: true,
          name: { contains: query },
        },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : []

  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-amber-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Cari Produk</span>
        </nav>

        {/* Search input */}
        <form action="/search" className="mb-8">
          <div className="flex gap-2 max-w-xl">
            <input
              name="q"
              defaultValue={query}
              placeholder="Cari produk..."
              className="flex-1 rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Cari
            </button>
          </div>
        </form>

        {!query ? (
          <div className="bg-white rounded-xl border border-amber-100 p-16 text-center">
            <p className="text-gray-400 text-lg mb-2">
              Masukkan kata kunci pencarian
            </p>
            <p className="text-gray-400 text-sm">
              Cari produk Muslim fashion favorit Anda
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-amber-100 p-16 text-center">
            <p className="text-gray-400 text-lg mb-2">
              &ldquo;{query}&rdquo; tidak ditemukan
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Coba kata kunci lain atau lihat produk kami
            </p>
            <Link
              href="/products"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Lihat Semua Produk
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Menampilkan {products.length} hasil untuk &ldquo;{query}&rdquo;
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    images: product.images,
                    category: product.category
                      ? {
                          name: product.category.name,
                          slug: product.category.slug,
                        }
                      : null,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
