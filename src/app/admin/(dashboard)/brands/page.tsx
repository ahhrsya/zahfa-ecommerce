import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"
import DeleteButton from "./_components/DeleteButton"

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({ orderBy: { sortOrder: "asc" } })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Brand</h1>
        <Link href="/admin/brands/create" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" /> Tambah Brand
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left px-4 py-3 font-medium">Logo</th>
              <th className="text-left px-4 py-3 font-medium">Nama</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-center px-4 py-3 font-medium">Urutan</th>
              <th className="text-center px-4 py-3 font-medium">Status</th>
              <th className="text-center px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="w-12 h-12 object-contain rounded-lg border" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                <td className="px-4 py-3 text-gray-500">{b.slug}</td>
                <td className="px-4 py-3 text-center">{b.sortOrder}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {b.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/brands/create?id=${b.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</Link>
                    <DeleteButton id={b.id} />
                  </div>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">Belum ada brand</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
