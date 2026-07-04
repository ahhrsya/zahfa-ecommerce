"use client"

import Link from "next/link"
import Image from "next/image"
import { formatRupiah } from "@/lib/utils"

type ProductCardProps = {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice: number | null
    images: { url: string; alt: string | null }[]
    category: { name: string; slug: string } | null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null

  return (
    <div className="group relative bg-white rounded-sm border border-stone-200 transition-all duration-300 hover:shadow-md">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] bg-stone-50 overflow-hidden">
        {product.images?.[0]?.url ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-16 h-16 text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {discount && discount > 0 && (
          <span className="absolute top-2 left-2 bg-stone-900 text-white text-[10px] font-medium px-2 py-0.5">
            -{discount}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-3">
        {product.category && (
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-[11px] text-stone-400 font-body hover:text-stone-600"
          >
            {product.category.name}
          </Link>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-stone-800 mt-0.5 leading-snug line-clamp-2 font-body hover:text-stone-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5">
          <span className="text-sm font-bold text-stone-900 font-body">{formatRupiah(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-stone-400 line-through ml-2 font-body">{formatRupiah(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
