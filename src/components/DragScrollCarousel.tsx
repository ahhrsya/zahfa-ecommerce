"use client"

import { useRef, useState, useEffect, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  children: ReactNode
  gap?: number
}

export default function DragScrollCarousel({ children, gap = 16 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftStart, setScrollLeftStart] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = () => {
    const el = ref.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener("scroll", updateScrollState, { passive: true })
    updateScrollState()
    return () => el.removeEventListener("scroll", updateScrollState)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    setIsDragging(true)
    setStartX(e.pageX - el.getBoundingClientRect().left)
    setScrollLeftStart(el.scrollLeft)
    el.style.cursor = "grabbing"
    el.style.userSelect = "none"
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const el = ref.current
    if (!el) return
    const x = e.pageX - el.getBoundingClientRect().left
    const walk = (x - startX) * 1.5
    el.scrollLeft = scrollLeftStart - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    const el = ref.current
    if (el) {
      el.style.cursor = ""
      el.style.userSelect = ""
    }
  }

  const scrollTo = (dir: "left" | "right") => {
    const el = ref.current
    if (!el) return
    const child = el.children[0] as HTMLElement | undefined
    const cardWidth = child?.offsetWidth || 250
    el.scrollBy({
      left: dir === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    })
  }

  return (
    <div className="group">
      <div
        ref={ref}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex overflow-x-auto scroll-smooth"
        style={{
          gap,
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {children}
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={() => scrollTo("left")}
          disabled={!canScrollLeft}
          className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${
            canScrollLeft
              ? "bg-white border-stone-300 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 shadow-sm"
              : "bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed"
          }`}
          aria-label="Geser kiri"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scrollTo("right")}
          disabled={!canScrollRight}
          className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all ${
            canScrollRight
              ? "bg-white border-stone-300 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 shadow-sm"
              : "bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed"
          }`}
          aria-label="Geser kanan"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
