"use client"

import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  slug: string
}

interface FiltersProps {
  categories: Category[]
  selectedCategory: string
  sort: string
  minPrice: number | undefined
  maxPrice: number | undefined
  search: string
  page: number
}

function buildUrl(
  updates: Record<string, string | undefined>,
  current: FiltersProps
) {
  const params = new URLSearchParams()
  if (current.search) params.set("search", current.search)
  if (updates.kategori ?? current.selectedCategory)
    params.set("kategori", updates.kategori ?? current.selectedCategory)
  if ((updates.urutkan ?? current.sort) !== "terbaru")
    params.set("urutkan", updates.urutkan ?? current.sort)
  if (updates.harga_min ?? current.minPrice)
    params.set("harga_min", String(updates.harga_min ?? current.minPrice))
  if (updates.harga_max ?? current.maxPrice)
    params.set("harga_max", String(updates.harga_max ?? current.maxPrice))
  if (Number(updates.halaman ?? current.page) > 1)
    params.set("halaman", String(updates.halaman ?? current.page))
  Object.entries(updates).forEach(([k, v]) => {
    if (!v) params.delete(k)
  })
  const qs = params.toString()
  return `/products${qs ? `?${qs}` : ""}`
}

export function FilterSidebar({
  categories,
  selectedCategory,
  sort,
  minPrice,
  maxPrice,
  search,
  page,
}: FiltersProps) {
  const router = useRouter()
  const current: FiltersProps = {
    categories,
    selectedCategory,
    sort,
    minPrice,
    maxPrice,
    search,
    page,
  }

  return (
    <aside className="hidden lg:block w-64 shrink-0 space-y-6">
      {/* Kategori */}
      <div className="bg-white rounded-xl border border-amber-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Kategori</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-amber-700"
            >
              <input
                type="checkbox"
                checked={selectedCategory === cat.slug}
                onChange={() =>
                  (window.location.href = buildUrl(
                    {
                      kategori:
                        selectedCategory === cat.slug
                          ? undefined
                          : cat.slug,
                      halaman: undefined,
                    },
                    current
                  ))
                }
                className="accent-amber-600"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Rentang Harga */}
      <div className="bg-white rounded-xl border border-amber-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Rentang Harga</h3>
        <form
          action="/products"
          className="space-y-3"
        >
          <input
            type="number"
            name="harga_min"
            defaultValue={minPrice}
            placeholder="Min"
            className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input
            type="number"
            name="harga_max"
            defaultValue={maxPrice}
            placeholder="Max"
            className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Urutkan */}
      <div className="bg-white rounded-xl border border-amber-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-3">Urutkan</h3>
        <form action="/products" className="space-y-2">
          <select
            name="urutkan"
            defaultValue={sort}
            onChange={(e) =>
              (window.location.href = buildUrl(
                { urutkan: e.target.value, halaman: undefined },
                current
              ))
            }
            className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
          >
            <option value="terbaru">Terbaru</option>
            <option value="termurah">Termurah</option>
            <option value="termahal">Termahal</option>
            <option value="terpopuler">Terpopuler</option>
          </select>
        </form>
      </div>
    </aside>
  )
}

export function MobileFilterBar({
  categories,
  selectedCategory,
  sort,
  minPrice,
  maxPrice,
  search,
  page,
}: FiltersProps) {
  const current: FiltersProps = {
    categories,
    selectedCategory,
    sort,
    minPrice,
    maxPrice,
    search,
    page,
  }

  return (
    <div className="lg:hidden flex flex-wrap gap-2 mb-4 w-full">
      <form action="/products" className="flex gap-2 w-full">
        <select
          name="urutkan"
          defaultValue={sort}
          onChange={(e) =>
            (window.location.href = buildUrl(
              { urutkan: e.target.value, halaman: undefined },
              current
            ))
          }
          className="flex-1 rounded-lg border border-amber-200 px-3 py-2 text-sm bg-white"
        >
          <option value="terbaru">Terbaru</option>
          <option value="termurah">Termurah</option>
          <option value="termahal">Termahal</option>
          <option value="terpopuler">Terpopuler</option>
        </select>
      </form>
    </div>
  )
}
