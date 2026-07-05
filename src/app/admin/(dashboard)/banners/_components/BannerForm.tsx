"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createBanner, updateBanner } from "../actions"

export default function BannerForm({ banner }: { banner?: any }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const form = new FormData(e.currentTarget)

    try {
      if (banner) {
        await updateBanner(banner.id, form)
      } else {
        await createBanner(form)
      }
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan. Silakan coba lagi.")
      setSaving(false)
    }
  }

  return (
    <>
      {saving && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-xl flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-[3px] border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-700">Mengupload gambar dan menyimpan...</p>
          </div>
        </div>
      )}

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
          {banner?.image && (
            <div className="relative w-48 h-32 rounded-lg overflow-hidden mb-2 border">
              <img src={banner.image} alt={banner.title || "Preview banner"} className="w-full h-full object-cover" />
            </div>
          )}
          <input type="file" name="image" accept="image/*" required={!banner} className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
          <p className="text-xs text-gray-400 mt-1">Biarkan kosong jika tidak ingin mengubah gambar</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
            <input type="number" name="sortOrder" defaultValue={banner?.sortOrder || 0} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="isActive" defaultChecked={banner?.isActive ?? true} className="rounded" />
              <span className="text-gray-700">Aktif</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
        )}

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
              banner ? "Simpan Perubahan" : "Simpan"
            )}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Batal</button>
        </div>
      </form>
    </>
  )
}
