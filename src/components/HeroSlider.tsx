"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Banner = {
  id: string
  title: string | null
  subtitle: string | null
  image: string
  link: string | null
}

export default function HeroSlider({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length)
  }, [banners.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length)
  }, [banners.length])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [banners.length, next])

  if (!banners.length) return null

  return (
    <div className="relative w-full h-screen overflow-hidden bg-stone-100">
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {banner.image ? (
            <Image
              src={banner.image}
              alt={banner.title || "Banner"}
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-r from-stone-800 to-stone-700">
              <div className="text-center text-white px-6">
                <h2 className="text-3xl md:text-5xl font-heading font-bold mb-2">{banner.title || "Zahfa"}</h2>
                {banner.subtitle && <p className="text-lg md:text-xl font-body">{banner.subtitle}</p>}
              </div>
            </div>
          )}

          {/* Text Overlay */}
          {(banner.title || banner.subtitle) && banner.image && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
              <div className="absolute bottom-10 left-6 md:bottom-14 md:left-12 text-left text-white max-w-xl">
                {banner.title && (
                  <h2 className="text-3xl md:text-5xl font-heading font-bold mb-2 drop-shadow-lg">{banner.title}</h2>
                )}
                {banner.subtitle && (
                  <p className="text-base md:text-lg font-light drop-shadow-md opacity-90">{banner.subtitle}</p>
                )}
                {banner.link && (
                  <Link
                    href={banner.link}
                    className="inline-block mt-6 px-8 py-3 bg-white text-stone-800 font-medium text-sm tracking-wider uppercase hover:bg-stone-100 transition-colors"
                  >
                    Belanja Sekarang
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/60 hover:bg-white/90 transition-colors"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/60 hover:bg-white/90 transition-colors"
            aria-label="Selanjutnya"
          >
            <ChevronRight className="w-5 h-5 text-stone-700" />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === current ? "bg-white w-6" : "bg-white/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
