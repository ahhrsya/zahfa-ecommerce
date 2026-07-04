"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag } from "lucide-react"
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
  isNew?: boolean
  isBest?: boolean
  isTrending?: boolean
}

export default function ProductCard({
  product,
  isNew,
  isBest,
  isTrending,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : null

  function checkWishlist() {
    const saved = localStorage.getItem("wishlist")
    if (saved) {
      try {
        const items: { id: string }[] = JSON.parse(saved)
        setIsWishlisted(items.some((item) => item.id === product.id))
      } catch {
        setIsWishlisted(false)
      }
    } else {
      setIsWishlisted(false)
    }
  }

  useEffect(() => {
    checkWishlist()
    const handleUpdate = () => checkWishlist()
    window.addEventListener("wishlist-updated", handleUpdate)
    return () => window.removeEventListener("wishlist-updated", handleUpdate)
  }, [product.id])

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const saved = localStorage.getItem("wishlist")
    let items: Array<{
      id: string
      name: string
      slug: string
      price: number
      compareAtPrice: number | null
      images: { url: string; alt: string | null }[]
      category: { name: string; slug: string } | null
    }> = []

    if (saved) {
      try {
        items = JSON.parse(saved)
      } catch {
        items = []
      }
    }

    const exists = items.some((item) => item.id === product.id)
    if (exists) {
      items = items.filter((item) => item.id !== product.id)
    } else {
      items.push(product)
    }

    localStorage.setItem("wishlist", JSON.stringify(items))
    setIsWishlisted(!exists)
    window.dispatchEvent(
      new StorageEvent("storage", { key: "wishlist", newValue: JSON.stringify(items) })
    )
    window.dispatchEvent(new CustomEvent("wishlist-updated"))
  }

  function addToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const saved = localStorage.getItem("cart")
    let items: Array<{
      productId: string
      name: string
      slug: string
      price: number
      image: string
      quantity: number
      variant: string
    }> = []

    if (saved) {
      try {
        items = JSON.parse(saved)
      } catch {
        items = []
      }
    }

    const existing = items.find((item) => item.productId === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0]?.url || "",
        quantity: 1,
        variant: "",
      })
    }

    localStorage.setItem("cart", JSON.stringify(items))
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    localStorage.setItem("zahfa_cart_count", String(count))
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "zahfa_cart_count",
        newValue: String(count),
      })
    )
  }

  const badges: { text: string; className: string }[] = []
  if (isNew) badges.push({ text: "NEW", className: "bg-stone-900 text-white" })
  if (isBest) badges.push({ text: "BEST", className: "bg-stone-900 text-white" })
  if (isTrending) badges.push({ text: "TRENDING", className: "bg-stone-900 text-white" })
  if (discount && discount > 0) {
    badges.push({ text: `SALE ${discount}%`, className: "bg-amber-600 text-white" })
  }

  return (
    <div className="group relative">
      {/* Badges */}
      {badges.length > 0 && (
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
          {badges.map((badge, i) => (
            <span
              key={i}
              className={`text-[10px] font-medium px-2.5 py-1 uppercase tracking-wider ${badge.className}`}
            >
              {badge.text}
            </span>
          ))}
        </div>
      )}

      {/* Wishlist button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all"
        aria-label={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isWishlisted ? "fill-red-500 text-red-500" : "text-stone-600"
          }`}
        />
      </button>

      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-[4/3] bg-stone-100 overflow-hidden rounded-sm"
      >
        {product.images?.[0]?.url ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-16 h-16 text-stone-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="pt-3">
        {product.category && (
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            {product.category.name}
          </Link>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-stone-900 mt-0.5 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-stone-900">
              {formatRupiah(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-red-400 line-through">
                {formatRupiah(product.compareAtPrice)}
              </span>
            )}
          </div>
          <button
            onClick={addToCart}
            className="p-2 border border-stone-300 rounded-sm text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
            aria-label="Tambah ke keranjang"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
