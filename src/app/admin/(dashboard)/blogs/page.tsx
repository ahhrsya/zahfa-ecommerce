import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"
import DeleteButton from "./_components/DeleteButton"

export default async function BlogsPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
        <Link href="/admin/blogs/create" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" /> Tambah Post
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left px-4 py-3 font-medium">Gambar</th>
              <th className="text-left px-4 py-3 font-medium">Judul</th>
              <th className="text-left px-4 py-3 font-medium">Penulis</th>
              <th className="text-left px-4 py-3 font-medium">Tanggal</th>
              <th className="text-center px-4 py-3 font-medium">Status</th>
              <th className="text-center px-4 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-16 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-16 h-12 bg-gray-100 rounded-lg" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
                <td className="px-4 py-3 text-gray-500">{p.author || "-"}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(p.createdAt).toLocaleDateString("id-ID")}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/blogs/create?id=${p.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</Link>
                    <DeleteButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">Belum ada post</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
