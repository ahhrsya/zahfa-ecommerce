"use client"

interface SortSelectProps {
  slug: string
  currentSort: string
}

export function SortSelect({ slug, currentSort }: SortSelectProps) {
  return (
    <select
      name="urutkan"
      defaultValue={currentSort}
      onChange={(e) => {
        const params = new URLSearchParams()
        if (e.target.value !== "terbaru")
          params.set("urutkan", e.target.value)
        const qs = params.toString()
        window.location.href = `/categories/${slug}${qs ? `?${qs}` : ""}`
      }}
      className="rounded-lg border border-amber-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
    >
      <option value="terbaru">Terbaru</option>
      <option value="termurah">Termurah</option>
      <option value="termahal">Termahal</option>
    </select>
  )
}
