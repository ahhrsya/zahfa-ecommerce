import { prisma } from "@/lib/prisma"
import BrandForm from "../_components/BrandForm"

export default async function BrandCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await searchParams
  const brand = id ? await prisma.brand.findUnique({ where: { id: id as string } }) : null

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{brand ? "Edit Brand" : "Tambah Brand"}</h1>
      <BrandForm brand={brand} />
    </div>
  )
}
