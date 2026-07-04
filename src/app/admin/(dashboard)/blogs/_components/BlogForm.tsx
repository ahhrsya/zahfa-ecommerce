'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createBlogPost, updateBlogPost } from "../actions"

export default function BlogForm({ post }: { post?: any }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)
    if (post) {
      await updateBlogPost(post.id, form)
    } else {
      await createBlogPost(form)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 max-w-3xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
        <input name="title" defaultValue={post?.title || ""} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
          <input name="author" defaultValue={post?.author || ""} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={post?.isActive ?? true} className="rounded" /> Aktif
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
        <textarea name="content" defaultValue={post?.content || ""} required rows={12} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-mono" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan (Excerpt)</label>
        <textarea name="excerpt" defaultValue={post?.excerpt || ""} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
        {post?.image && <img src={post.image} alt="" className="w-48 h-32 object-cover rounded-lg mb-2 border" />}
        <input type="file" name="image" accept="image/*" className="text-sm" />
      </div>
      <div className="flex gap-3 pt-4 border-t">
        <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">
          {saving ? "Menyimpan..." : post ? "Simpan Perubahan" : "Simpan"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
      </div>
    </form>
  )
}
