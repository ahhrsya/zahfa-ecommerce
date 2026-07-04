"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProductCard from "@/components/ProductCard"

interface WishlistItem {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice: number | null
  images: { url: string; alt: string | null }[]
  category: { name: string; slug: string } | null
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("wishlist")
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        setItems([])
      }
    }
  }, [])

  function removeItem(slug: string) {
    const updated = items.filter((item) => item.slug !== slug)
    setItems(updated)
    localStorage.setItem("wishlist", JSON.stringify(updated))
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-amber-50/40 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-amber-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Wishlist</span>
        </nav>

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Wishlist
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-amber-100 p-16 text-center">
            <div className="text-5xl mb-4">🤍</div>
            <p className="text-gray-500 mb-4">
              Wishlist Anda masih kosong
            </p>
            <Link
              href="/products"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="relative">
                <ProductCard product={item} />
                <button
                  onClick={() => removeItem(item.slug)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-white transition-all shadow-sm"
                  title="Hapus dari wishlist"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
