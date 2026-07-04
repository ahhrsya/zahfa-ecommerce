"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Props {
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string
  }
}

export default function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false)
  const router = useRouter()

  function handleAdd() {
    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    )
    const existing = cart.find(
      (item: { productId: string }) =>
        item.productId === product.id
    )
    if (existing) {
      existing.quantity += 1
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image,
        quantity: 1,
        variant: "",
      })
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-all active:scale-[0.98]"
    >
      {added ? "✓ Ditambahkan ke Keranjang" : "Tambah ke Keranjang"}
    </button>
  )
}
