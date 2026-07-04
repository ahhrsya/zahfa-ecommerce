import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductForm from "../_components/ProductForm"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { sortOrder: "asc" } }, images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ])

  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Produk</h1>
      <ProductForm product={product} categories={categories} brands={brands} />
    </div>
  )
}
