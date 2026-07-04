"use client"

import { useState } from "react"

interface VariantItem {
  id: string
  name: string
  price: number | null
  stock: number
}

interface Props {
  sizes: VariantItem[]
  colors: VariantItem[]
}

export default function VariantSelector({ sizes, colors }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Ukuran:
            {selectedSize && (
              <span className="text-amber-700 ml-1">
                {sizes.find((s) => s.id === selectedSize)?.name}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size.id
              const isOutOfStock = size.stock === 0
              return (
                <button
                  key={size.id}
                  onClick={() => !isOutOfStock && setSelectedSize(size.id)}
                  disabled={isOutOfStock}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    isOutOfStock
                      ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50 line-through"
                      : isSelected
                      ? "border-amber-600 bg-amber-50 text-amber-700"
                      : "border-amber-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50"
                  }`}
                >
                  {size.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Warna:
            {selectedColor && (
              <span className="text-amber-700 ml-1">
                {colors.find((c) => c.id === selectedColor)?.name}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color.id
              const isOutOfStock = color.stock === 0
              return (
                <button
                  key={color.id}
                  onClick={() => !isOutOfStock && setSelectedColor(color.id)}
                  disabled={isOutOfStock}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    isOutOfStock
                      ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50 line-through"
                      : isSelected
                      ? "border-amber-600 bg-amber-50 text-amber-700"
                      : "border-amber-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50"
                  }`}
                >
                  {color.name}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
