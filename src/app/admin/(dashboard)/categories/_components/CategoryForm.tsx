'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createCategory, updateCategory } from "../actions"

export default function CategoryForm({ category }: { category?: any }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)
    if (category) {
      await updateCategory(category.id, form)
    } else {
      await createCategory(form)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <input name="name" defaultValue={category?.name || ""} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea name="description" defaultValue={category?.description || ""} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
        {category?.image && <img src={category.image} alt={category.name || "Preview kategori"} className="w-24 h-24 object-cover rounded-lg mb-2 border" />}
        <input type="file" name="image" accept="image/*" className="text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
          <input type="number" name="sortOrder" defaultValue={category?.sortOrder || 0} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={category?.isActive ?? true} className="rounded" />
            Aktif
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-4 border-t">
        <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
          {saving ? "Menyimpan..." : category ? "Simpan Perubahan" : "Simpan"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          Batal
        </button>
      </div>
    </form>
  )
}
