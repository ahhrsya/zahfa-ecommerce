import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { formatRupiah } from "@/lib/utils"
import { getSetting } from "@/app/checkout/actions"
import ProductGallery from "./ProductGallery"
import VariantSelector from "./VariantSelector"
import QuantitySelector from "./QuantitySelector"
import AddToCartButton from "./AddToCartButton"
import WhastappButton from "./WhatsappButton"
import ProductCard from "@/components/ProductCard"
import { SITE_NAME, SITE_URL } from "@/lib/site"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { category: true, images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  })

  if (!product) {
    return { title: "Produk Tidak Ditemukan" }
  }

  const title = `${product.name} | ${SITE_NAME}`
  const description = product.description
    ? product.description.slice(0, 160).replace(/\s+/g, " ").trim()
    : `Beli ${product.name} di ${SITE_NAME}. Busana muslimah modern, syar'i, dan berkualitas.`
  const image = product.images[0]?.url
    ? `${SITE_URL}${product.images[0].url}`
    : `${SITE_URL}/uploads/banners/hero1.png`

  return {
    title,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      url: `/products/${slug}`,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
      category: true,
      brand: true,
    },
  })

  if (!product) notFound()

  const relatedProducts = product.categoryId
    ? await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true,
        },
        take: 4,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : []

  const waNumber = (await getSetting("WA_NUMBER")) || "6281234567890"

  const inStock = product.stock > 0
  const hasVariants = product.variants.length > 0
  const sizes = product.variants.filter((v) => v.type === "size")
  const colors = product.variants.filter((v) => v.type === "warna")

  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex flex-wrap items-center gap-1">
          <Link href="/" className="hover:text-amber-700">
            Home
          </Link>
          <span className="mx-1">/</span>
          {product.category ? (
            <>
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-amber-700"
              >
                {product.category.name}
              </Link>
              <span className="mx-1">/</span>
            </>
          ) : null}
          <span className="text-gray-800">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Image Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Info */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  {product.brand.name}
                </p>
              )}
              <h1 className="text-2xl font-semibold text-gray-800">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < 4 ? "text-amber-400" : "text-gray-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-400 ml-1">(4.0)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-amber-700">
                {formatRupiah(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    {formatRupiah(product.compareAtPrice)}
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    -
                    {Math.round(
                      ((product.compareAtPrice - product.price) /
                        product.compareAtPrice) *
                        100
                    )}
                    %
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <p
              className={`text-sm ${
                inStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {inStock
                ? `Stok tersedia (${product.stock})`
                : "Stok habis"}
            </p>

            {/* Variants */}
            {hasVariants && (
              <VariantSelector
                sizes={sizes.map((v) => ({
                  id: v.id,
                  name: v.name,
                  price: v.price,
                  stock: v.stock,
                }))}
                colors={colors.map((v) => ({
                  id: v.id,
                  name: v.name,
                  price: v.price,
                  stock: v.stock,
                }))}
              />
            )}

            {/* Quantity */}
            <QuantitySelector slug={product.slug} />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  image:
                    product.images[0]?.url || "",
                }}
              />
              <WhastappButton
                waNumber={waNumber}
                productName={product.name}
                productPrice={product.price}
                slug={product.slug}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-16">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Deskripsi Produk
            </h2>
            <div className="bg-white rounded-xl border border-amber-100 p-6 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <ProductCard
                  key={rp.id}
                  product={{
                    id: rp.id,
                    name: rp.name,
                    slug: rp.slug,
                    price: rp.price,
                    compareAtPrice: rp.compareAtPrice,
                    images: rp.images,
                    category: rp.category
                      ? {
                          name: rp.category.name,
                          slug: rp.category.slug,
                        }
                      : null,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* JSON-LD Product Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              image: product.images.map((img) => `${SITE_URL}${img.url}`),
              description: product.description || `Beli ${product.name} di ${SITE_NAME}`,
              sku: product.sku || product.slug,
              brand: {
                "@type": "Brand",
                name: product.brand?.name || SITE_NAME,
              },
              category: product.category?.name || "Busana Muslimah",
              offers: {
                "@type": "Offer",
                url: `${SITE_URL}/products/${product.slug}`,
                priceCurrency: "IDR",
                price: String(product.price),
                availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                itemCondition: "https://schema.org/NewCondition",
                priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.0",
                reviewCount: "1",
              },
            }),
          }}
        />

        {/* JSON-LD BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                ...(product.category
                  ? [{ "@type": "ListItem", position: 2, name: product.category.name, item: `${SITE_URL}/categories/${product.category.slug}` }]
                  : []),
                { "@type": "ListItem", position: product.category ? 3 : 2, name: product.name, item: `${SITE_URL}/products/${product.slug}` },
              ],
            }),
          }}
        />
      </div>
    </div>
  )
}
