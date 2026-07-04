import { prisma } from "@/lib/prisma"
import CategoryForm from "../_components/CategoryForm"

export default async function CategoryCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await searchParams
  const category = id ? await prisma.category.findUnique({ where: { id: id as string } }) : null

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{category ? "Edit Kategori" : "Tambah Kategori"}</h1>
      <CategoryForm category={category} />
    </div>
  )
}
