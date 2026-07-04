"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatRupiah } from "@/lib/utils"

interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
  variant: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("cart")
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch {
        setCart([])
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, mounted])

  function updateQuantity(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function removeItem(productId: string) {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  if (!mounted) {
    return (
      <div className="min-h-screen bg-amber-50/40 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-amber-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Keranjang</span>
        </nav>

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Keranjang Belanja
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl border border-amber-100 p-16 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-gray-500 mb-4">
              Keranjang belanja Anda masih kosong
            </p>
            <Link
              href="/products"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl border border-amber-100 p-4 flex gap-4"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-amber-50"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-amber-300 text-xs">
                        No Image
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium text-gray-800 hover:text-amber-700 line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.variant}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-amber-700 mt-1">
                      {formatRupiah(item.price)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, -1)
                          }
                          className="w-9 h-9 rounded border border-amber-200 flex items-center justify-center text-gray-500 hover:bg-amber-50 text-sm"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, 1)
                          }
                          className="w-9 h-9 rounded border border-amber-200 flex items-center justify-center text-gray-500 hover:bg-amber-50 text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl border border-amber-100 p-6 h-fit sticky top-4">
              <h2 className="font-semibold text-gray-800 mb-4">
                Ringkasan Belanja
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Total Barang</span>
                  <span>{totalItems} item</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg font-medium transition-colors"
              >
                Checkout via WhatsApp
              </Link>
              <Link
                href="/products"
                className="mt-3 block w-full text-center text-sm text-amber-600 hover:text-amber-700 transition-colors"
              >
                Lanjut Belanja
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
