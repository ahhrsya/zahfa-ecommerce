"use client"

import { useState } from "react"
import Image from "next/image"

interface Props {
  images: { url: string; alt: string | null }[]
  name: string
}

export default function ProductGallery({ images, name }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const displayImages =
    images.length > 0
      ? images
      : [{ url: "/placeholder.png", alt: null }]

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-amber-50 rounded-xl overflow-hidden border border-amber-100">
        <Image
          src={displayImages[selectedIndex].url}
          alt={
            displayImages[selectedIndex].alt || `${name} - gambar ${selectedIndex + 1}`
          }
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                i === selectedIndex
                  ? "border-amber-600 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-80"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${name} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
