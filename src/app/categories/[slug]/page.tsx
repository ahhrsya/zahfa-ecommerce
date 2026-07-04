import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"
import { SortSelect } from "./SortSelect"
import { SITE_NAME, SITE_URL } from "@/lib/site"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
  })

  if (!category) {
    return { title: "Kategori Tidak Ditemukan" }
  }

  const title = `${category.name} | ${SITE_NAME}`
  const description = category.description
    ? `${category.description} - Belanja koleksi ${category.name} terbaru di ${SITE_NAME}.`
    : `Belanja koleksi ${category.name} terbaru dari ${SITE_NAME}. Busana muslimah modern, syar'i, dan berkualitas.`

  return {
    title,
    description,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      url: `/categories/${slug}`,
      title,
      description,
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params
  const sp = await searchParams
  const sort =
    typeof sp.urutkan === "string" ? sp.urutkan : "terbaru"

  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
  })

  if (!category) notFound()

  let orderBy: Record<string, string> = { createdAt: "desc" }
  if (sort === "termurah") orderBy = { price: "asc" }
  if (sort === "termahal") orderBy = { price: "desc" }

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    orderBy,
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
    },
  })

  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-amber-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-sm text-gray-500 mt-2">
              {category.description}
            </p>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {products.length} produk ditemukan
          </p>
          <SortSelect slug={slug} currentSort={sort} />
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-amber-100 p-16 text-center">
            <p className="text-gray-400 text-lg">
              Belum ada produk di kategori ini
            </p>
          </div>
        ) : (
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
        )}
      </div>

      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/categories/${category.slug}` },
            ],
          }),
        }}
      />
    </div>
  )
}
