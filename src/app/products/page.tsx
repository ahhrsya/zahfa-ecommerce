import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"
import { FilterSidebar, MobileFilterBar } from "./Filters"
import { SITE_NAME, SITE_URL } from "@/lib/site"

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const ITEMS_PER_PAGE = 12

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Koleksi Produk",
  description: `Jelajahi koleksi lengkap busana muslimah modern dari ${SITE_NAME}. Gamis, hijab, dress syar'i, dan aksesoris muslimah berkualitas.`,
  alternates: { canonical: "/products" },
  openGraph: {
    url: "/products",
    title: `Koleksi Produk | ${SITE_NAME}`,
    description: `Jelajahi koleksi lengkap busana muslimah modern dari ${SITE_NAME}.`,
  },
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams
  const search =
    typeof sp.search === "string" ? sp.search : ""
  const categorySlug =
    typeof sp.kategori === "string" ? sp.kategori : ""
  const sort =
    typeof sp.urutkan === "string" ? sp.urutkan : "terbaru"
  const minPrice =
    typeof sp.harga_min === "string" ? Number(sp.harga_min) : undefined
  const maxPrice =
    typeof sp.harga_max === "string" ? Number(sp.harga_max) : undefined
  const page =
    typeof sp.halaman === "string" ? Math.max(1, Number(sp.halaman)) : 1

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  })

  const where: Record<string, unknown> = { isActive: true }

  if (search) {
    where.name = { contains: search }
  }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: Record<string, number> = {}
    if (minPrice !== undefined) priceFilter.gte = minPrice
    if (maxPrice !== undefined) priceFilter.lte = maxPrice
    where.price = priceFilter
  }

  let orderBy: Record<string, string> = { createdAt: "desc" }
  if (sort === "termurah") orderBy = { price: "asc" }
  if (sort === "termahal") orderBy = { price: "desc" }
  if (sort === "terpopuler") orderBy = { createdAt: "desc" }

  const totalProducts = await prisma.product.count({ where: where as any })
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)

  const products = await prisma.product.findMany({
    where: where as any,
    orderBy,
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
    },
  })

  function buildUrl(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (categorySlug) params.set("kategori", categorySlug)
    if (sort && sort !== "terbaru") params.set("urutkan", sort)
    if (minPrice) params.set("harga_min", String(minPrice))
    if (maxPrice) params.set("harga_max", String(maxPrice))
    if (page > 1) params.set("halaman", String(page))
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    const qs = params.toString()
    return `/products${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-amber-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Produk</span>
        </nav>

        {/* Search */}
        <form
          action="/products"
          className="mb-8 flex gap-2 max-w-xl"
        >
          <input
            name="search"
            defaultValue={search}
            placeholder="Cari produk..."
            className="flex-1 rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
          />
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Cari
          </button>
        </form>

        <div className="flex gap-8">
          <FilterSidebar
            categories={categories}
            selectedCategory={categorySlug}
            sort={sort}
            minPrice={minPrice}
            maxPrice={maxPrice}
            search={search}
            page={page}
          />

          <MobileFilterBar
            categories={categories}
            selectedCategory={categorySlug}
            sort={sort}
            minPrice={minPrice}
            maxPrice={maxPrice}
            search={search}
            page={page}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Menampilkan {products.length} dari {totalProducts} produk
              </p>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">
                  Produk tidak ditemukan
                </p>
                <Link
                  href="/products"
                  className="text-amber-600 hover:text-amber-700 text-sm mt-2 inline-block"
                >
                  Reset filter
                </Link>
              </div>
            ) : (
              <>
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {page > 1 && (
                      <Link
                        href={buildUrl({
                          halaman: String(page - 1),
                        })}
                        className="px-4 py-2 rounded-lg border border-amber-200 text-sm text-gray-600 hover:bg-amber-50 transition-colors"
                      >
                        Sebelumnya
                      </Link>
                    )}

                    {Array.from(
                      { length: totalPages },
                      (_, i) => i + 1
                    ).map((p) => (
                      <Link
                        key={p}
                        href={buildUrl({
                          halaman: p === 1 ? undefined : String(p),
                        })}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                          p === page
                            ? "bg-amber-600 text-white"
                            : "border border-amber-200 text-gray-600 hover:bg-amber-50"
                        }`}
                      >
                        {p}
                      </Link>
                    ))}

                    {page < totalPages && (
                      <Link
                        href={buildUrl({
                          halaman: String(page + 1),
                        })}
                        className="px-4 py-2 rounded-lg border border-amber-200 text-sm text-gray-600 hover:bg-amber-50 transition-colors"
                      >
                        Selanjutnya
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
