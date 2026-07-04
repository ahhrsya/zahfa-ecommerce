"use client"

import { useState } from "react"

interface Props {
  slug: string
}

export default function QuantitySelector({ slug }: Props) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Jumlah:</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-10 rounded-lg border border-amber-200 flex items-center justify-center text-gray-600 hover:bg-amber-50 transition-colors"
        >
          -
        </button>
        <span className="w-10 text-center font-medium text-gray-800">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="w-10 h-10 rounded-lg border border-amber-200 flex items-center justify-center text-gray-600 hover:bg-amber-50 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
