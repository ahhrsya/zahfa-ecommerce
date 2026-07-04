import { prisma } from "@/lib/prisma"
import ProductForm from "../_components/ProductForm"

export default async function CreateProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tambah Produk</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  )
}
