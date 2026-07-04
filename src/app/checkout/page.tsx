"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatRupiah } from "@/lib/utils"
import { createOrder, getSetting } from "./actions"

interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
  variant: string
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [ongkir, setOngkir] = useState(0)

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    notes: "",
  })

  const [waNumber, setWaNumber] = useState("")

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
    getSetting("WA_NUMBER").then((num) => {
      setWaNumber(num || "6281234567890")
    })
  }, [])

  const totalBelanja = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const grandTotal = totalBelanja + ongkir

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.customerName || !form.customerPhone) return
    setSubmitting(true)

    try {
      const order = await createOrder({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        customerAddress: form.customerAddress,
        notes: form.notes,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
        })),
        total: grandTotal,
      })

      const itemsText = cart
        .map(
          (item) =>
            `- ${item.name}${item.variant ? ` (${item.variant})` : ""} x ${item.quantity} = ${formatRupiah(item.price * item.quantity)}`
        )
        .join("\n")

      const message = `Halo, saya ingin melakukan pemesanan:\n\n*Data Pemesan*\nNama: ${form.customerName}\nEmail: ${form.customerEmail}\nNo. HP: ${form.customerPhone}\nAlamat: ${form.customerAddress}\nCatatan: ${form.notes || "-"}\n\n*Pesanan*\n${itemsText}\n\n*Ringkasan*\nSubtotal: ${formatRupiah(totalBelanja)}\nOngkos Kirim: ${formatRupiah(ongkir)}\nTotal: ${formatRupiah(grandTotal)}\n\nNo. Order: ${order.orderNumber}`

      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`

      localStorage.removeItem("cart")
      window.location.href = waUrl
    } catch (err) {
      console.error("Checkout error:", err)
      alert("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-amber-50/40 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50/40">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-amber-700">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Checkout</span>
          </nav>
          <div className="bg-white rounded-xl border border-amber-100 p-16 text-center">
            <p className="text-gray-500 mb-4">
              Keranjang Anda kosong. Silakan tambah produk terlebih dahulu.
            </p>
            <Link
              href="/products"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Mulai Belanja
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-amber-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/cart" className="hover:text-amber-700">Keranjang</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Checkout</span>
        </nav>

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-5 gap-8">
            {/* Form */}
            <div className="md:col-span-3 space-y-4">
              <div className="bg-white rounded-xl border border-amber-100 p-6">
                <h2 className="font-semibold text-gray-800 mb-4">
                  Data Pemesan
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.customerName}
                      onChange={(e) =>
                        setForm({ ...form, customerName: e.target.value })
                      }
                      className="w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.customerEmail}
                      onChange={(e) =>
                        setForm({ ...form, customerEmail: e.target.value })
                      }
                      className="w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      placeholder="contoh@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. HP <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.customerPhone}
                      onChange={(e) =>
                        setForm({ ...form, customerPhone: e.target.value })
                      }
                      className="w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat Pengiriman
                    </label>
                    <textarea
                      value={form.customerAddress}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          customerAddress: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      rows={3}
                      placeholder="Masukkan alamat lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      className="w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      rows={2}
                      placeholder="Catatan untuk produk atau pengiriman"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-amber-100 p-6">
                <h2 className="font-semibold text-gray-800 mb-4">
                  Ringkasan Pesanan
                </h2>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 items-start"
                    >
                      <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-amber-50">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-amber-300 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 line-clamp-1">
                          {item.name}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-gray-400">
                            {item.variant}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {item.quantity}x {formatRupiah(item.price)}
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 shrink-0">
                        {formatRupiah(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <hr className="my-4 border-amber-100" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatRupiah(totalBelanja)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 items-center">
                    <span>Ongkos Kirim</span>
                    <input
                      type="number"
                      value={ongkir}
                      onChange={(e) =>
                        setOngkir(Number(e.target.value) || 0)
                      }
                      className="w-28 text-right rounded-lg border border-amber-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      placeholder="0"
                    />
                  </div>
                  <hr className="border-amber-100" />
                  <div className="flex justify-between font-semibold text-gray-800">
                    <span>Total</span>
                    <span className="text-amber-700">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Pesan via WhatsApp
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
