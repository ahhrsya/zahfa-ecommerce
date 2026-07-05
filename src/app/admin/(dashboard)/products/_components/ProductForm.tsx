'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, GripVertical } from "lucide-react"
import { createProduct, updateProduct } from "../actions"

interface Variant {
  name: string
  type: string
  price: string
  stock: string
}

interface ImageItem {
  file: File | null
  url: string
  alt: string
}

interface Category { id: string; name: string }
interface Brand { id: string; name: string }

export default function ProductForm({
  product,
  categories,
  brands,
}: {
  product?: any
  categories: Category[]
  brands: Brand[]
}) {
  const router = useRouter()
  const [variants, setVariants] = useState<Variant[]>(
    product?.variants?.map((v: any) => ({
      name: v.name,
      type: v.type,
      price: v.price?.toString() || "",
      stock: v.stock.toString(),
    })) || []
  )
  const [images, setImages] = useState<ImageItem[]>(
    product?.images?.map((img: any) => ({
      file: null,
      url: img.url,
      alt: img.alt || "",
    })) || []
  )
  const [saving, setSaving] = useState(false)

  function addVariant() {
    setVariants([...variants, { name: "", type: "size", price: "", stock: "0" }])
  }

  function removeVariant(i: number) {
    setVariants(variants.filter((_, idx) => idx !== i))
  }

  function updateVariant(i: number, field: keyof Variant, value: string) {
    const updated = [...variants]
    updated[i] = { ...updated[i], [field]: value }
    setVariants(updated)
  }

  function addImage() {
    setImages([...images, { file: null, url: "", alt: "" }])
  }

  function removeImage(i: number) {
    setImages(images.filter((_, idx) => idx !== i))
  }

  function handleImageFile(i: number, file: File) {
    const url = URL.createObjectURL(file)
    const updated = [...images]
    updated[i] = { ...updated[i], file, url }
    setImages(updated)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)

    variants.forEach((v, i) => {
      form.append("variantName", v.name)
      form.append("variantType", v.type)
      form.append("variantPrice", v.price)
      form.append("variantStock", v.stock)
    })

    images.forEach((img, i) => {
      if (img.file) {
        form.append("images", img.file)
      }
      form.append(`imageAlt_${i}`, img.alt)
    })

    if (product) {
      await updateProduct(product.id, form)
    } else {
      await createProduct(form)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
          <input
            name="name"
            defaultValue={product?.name || ""}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
          <input
            type="number"
            name="price"
            defaultValue={product?.price || ""}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Harga Coret (Compare At)</label>
          <input
            type="number"
            name="compareAtPrice"
            defaultValue={product?.compareAtPrice || ""}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
          <input
            type="number"
            name="stock"
            defaultValue={product?.stock || 0}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select
            name="categoryId"
            defaultValue={product?.categoryId || ""}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
          <select
            name="brandId"
            defaultValue={product?.brandId || ""}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Pilih Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea
          name="description"
          defaultValue={product?.description || ""}
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} className="rounded" />
          Aktif
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} className="rounded" />
          Unggulan
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Varian</h3>
          <button type="button" onClick={addVariant} className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800">
            <Plus className="w-4 h-4" /> Tambah Varian
          </button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="flex items-end gap-2 mb-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Nama</label>
              <input
                value={v.name}
                onChange={(e) => updateVariant(i, "name", e.target.value)}
                placeholder="Contoh: S, M, L"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="w-28">
              <label className="block text-xs text-gray-500 mb-1">Tipe</label>
              <select value={v.type} onChange={(e) => updateVariant(i, "type", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="size">Ukuran</option>
                <option value="warna">Warna</option>
              </select>
            </div>
            <div className="w-28">
              <label className="block text-xs text-gray-500 mb-1">Harga</label>
              <input
                type="number"
                value={v.price}
                onChange={(e) => updateVariant(i, "price", e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="w-20">
              <label className="block text-xs text-gray-500 mb-1">Stok</label>
              <input
                type="number"
                value={v.stock}
                onChange={(e) => updateVariant(i, "stock", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <button type="button" onClick={() => removeVariant(i)} className="p-2 text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Gambar</h3>
          <button type="button" onClick={addImage} className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800">
            <Plus className="w-4 h-4" /> Tambah Gambar
          </button>
        </div>
        {images.map((img, i) => (
          <div key={i} className="flex items-center gap-3 mb-2 p-3 bg-gray-50 rounded-lg">
            {img.url && (
              <img src={img.url} alt="Preview gambar produk" className="w-16 h-16 object-cover rounded-lg border" />
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageFile(i, e.target.files[0])}
                className="text-sm"
              />
              <input
                placeholder="Alt text"
                value={img.alt}
                onChange={(e) => {
                  const updated = [...images]
                  updated[i] = { ...updated[i], alt: e.target.value }
                  setImages(updated)
                }}
                className="w-full mt-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <button type="button" onClick={() => removeImage(i)} className="p-2 text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : product ? "Simpan Perubahan" : "Simpan"}
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
