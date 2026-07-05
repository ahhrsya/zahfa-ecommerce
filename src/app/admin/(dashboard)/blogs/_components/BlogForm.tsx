"use client"

import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { createBlogPost, updateBlogPost } from "../actions"
import RichTextEditor from "@/components/RichTextEditor"

export default function BlogForm({ post }: { post?: any }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState(post?.content || "")
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)
    form.set("content", content)
    if (post) {
      await updateBlogPost(post.id, form)
    } else {
      await createBlogPost(form)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5 max-w-4xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
        <input
          name="title"
          defaultValue={post?.title || ""}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="Masukkan judul artikel"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
          <input
            name="author"
            defaultValue={post?.author || ""}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm"
            placeholder="Nama penulis"
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="isActive" defaultChecked={post?.isActive ?? true} className="rounded" />
            <span className="text-gray-700">Aktif</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Konten</label>
        <RichTextEditor value={content} onChange={setContent} placeholder="Tulis artikel di sini..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ringkasan <span className="text-gray-400 font-normal">(Excerpt — tampil di halaman blog)</span>
        </label>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt || ""}
          rows={2}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm"
          placeholder="Ringkasan singkat artikel"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Featured</label>
        {post?.image && (
          <div className="relative w-48 h-32 rounded-lg overflow-hidden mb-2 border">
            <img src={post.image} alt={post.title || "Preview artikel"} className="w-full h-full object-cover" />
          </div>
        )}
        <input type="file" name="image" accept="image/*" className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
        <p className="text-xs text-gray-400 mt-1">Biarkan kosong jika tidak ingin mengubah gambar</p>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Menyimpan...
            </>
          ) : (
            post ? "Simpan Perubahan" : "Simpan"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
