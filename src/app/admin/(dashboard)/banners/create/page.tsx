import { prisma } from "@/lib/prisma"
import BannerForm from "../_components/BannerForm"

export default async function BannerCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await searchParams
  const banner = id ? await prisma.banner.findUnique({ where: { id: id as string } }) : null

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{banner ? "Edit Banner" : "Tambah Banner"}</h1>
      <BannerForm banner={banner} />
    </div>
  )
}
