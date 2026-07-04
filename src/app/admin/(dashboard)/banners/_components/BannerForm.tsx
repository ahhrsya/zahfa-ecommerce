'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createBanner, updateBanner } from "../actions"

export default function BannerForm({ banner }: { banner?: any }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)
    if (banner) {
      await updateBanner(banner.id, form)
    } else {
      await createBanner(form)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <input name="title" defaultValue={banner?.title || ""} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subjudul</label>
          <input name="subtitle" defaultValue={banner?.subtitle || ""} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
          <select name="type" defaultValue={banner?.type || "hero"} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm">
            <option value="hero">Hero</option>
            <option value="brand">Brand</option>
            <option value="category">Kategori</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
          <input name="link" defaultValue={banner?.link || ""} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
        {banner?.image && <img src={banner.image} alt="" className="w-48 h-32 object-cover rounded-lg mb-2 border" />}
        <input type="file" name="image" accept="image/*" required={!banner} className="text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
          <input type="number" name="sortOrder" defaultValue={banner?.sortOrder || 0} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={banner?.isActive ?? true} className="rounded" /> Aktif
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-4 border-t">
        <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">
          {saving ? "Menyimpan..." : banner ? "Simpan Perubahan" : "Simpan"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
      </div>
    </form>
  )
}
