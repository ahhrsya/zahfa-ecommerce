import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"
import type { Banner } from "@prisma/client"
import DeleteButton from "./_components/DeleteButton"

export default async function BannersPage() {
  const banners: Banner[] = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banner</h1>
        <Link href="/admin/banners/create" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" /> Tambah Banner
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left px-4 py-3 font-medium">Gambar</th>
              <th className="text-left px-4 py-3 font-medium">Judul</th>
              <th className="text-left px-4 py-3 font-medium">Tipe</th>
              <th className="text-center px-4 py-3 font-medium">Urutan</th>
              <th className="text-center px-4 py-3 font-medium">Status</th>
              <th className="text-center px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img src={b.image} alt={b.title || "Preview banner"} className="w-24 h-16 object-cover rounded-lg" />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{b.title || "-"}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 uppercase">{b.type}</span>
                </td>
                <td className="px-4 py-3 text-center">{b.sortOrder}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {b.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/banners/create?id=${b.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</Link>
                    <DeleteButton id={b.id} />
                  </div>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">Belum ada banner</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
