import { prisma } from "@/lib/prisma"
import { formatRupiah } from "@/lib/utils"
import Link from "next/link"
import { Plus } from "lucide-react"
import DeleteButton from "./_components/DeleteButton"
import ToggleButton from "./_components/ToggleButton"
import ProductFilters from "./ProductFilters"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { q, category } = await searchParams
  const search = typeof q === "string" ? q : ""
  const catFilter = typeof category === "string" ? category : ""

  const where: any = {}
  if (search) where.name = { contains: search }
  if (catFilter) where.categoryId = catFilter

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <ProductFilters search={search} catFilter={catFilter} categories={categories} />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left px-4 py-3 font-medium">Nama</th>
                <th className="text-left px-4 py-3 font-medium">Kategori</th>
                <th className="text-right px-4 py-3 font-medium">Harga</th>
                <th className="text-right px-4 py-3 font-medium">Stok</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-center px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category?.name || "-"}</td>
                  <td className="px-4 py-3 text-right">{formatRupiah(p.price)}</td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3 text-center">
                    <ToggleButton id={p.id} isActive={p.isActive} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    Belum ada produk
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
