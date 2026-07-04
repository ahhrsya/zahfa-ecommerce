'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createBrand, updateBrand } from "../actions"

export default function BrandForm({ brand }: { brand?: any }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)
    if (brand) {
      await updateBrand(brand.id, form)
    } else {
      await createBrand(form)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Brand</label>
        <input name="name" defaultValue={brand?.name || ""} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea name="description" defaultValue={brand?.description || ""} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
        {brand?.logo && <img src={brand.logo} alt="" className="w-24 h-24 object-contain rounded-lg mb-2 border" />}
        <input type="file" name="logo" accept="image/*" className="text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
          <input type="number" name="sortOrder" defaultValue={brand?.sortOrder || 0} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={brand?.isActive ?? true} className="rounded" /> Aktif
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-4 border-t">
        <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">
          {saving ? "Menyimpan..." : brand ? "Simpan Perubahan" : "Simpan"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
      </div>
    </form>
  )
}
