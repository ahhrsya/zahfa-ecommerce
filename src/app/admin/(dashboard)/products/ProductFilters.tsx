"use client"

import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

interface Category {
  id: string
  name: string
}

export default function ProductFilters({
  search,
  catFilter,
  categories,
}: {
  search: string
  catFilter: string
  categories: Category[]
}) {
  const router = useRouter()

  function applyFilters(params: Record<string, string>) {
    const sp = new URLSearchParams()
    if (params.q) sp.set("q", params.q)
    if (params.category) sp.set("category", params.category)
    router.push(`/admin/products${sp.toString() ? `?${sp.toString()}` : ""}`)
  }

  return (
    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          name="q"
          defaultValue={search}
          placeholder="Cari produk..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search)
            params.set("q", e.target.value)
            window.location.search = params.toString()
          }}
        />
      </div>
      <select
        defaultValue={catFilter}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        onChange={(e) => {
          const params = new URLSearchParams(window.location.search)
          if (e.target.value) params.set("category", e.target.value)
          else params.delete("category")
          window.location.search = params.toString()
        }}
      >
        <option value="">Semua Kategori</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
    </div>
  )
}
