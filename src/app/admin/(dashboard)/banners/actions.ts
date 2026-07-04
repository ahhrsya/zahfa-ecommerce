'use server'

import { prisma } from "@/lib/prisma"
import { uploadFile, deleteFile } from "@/lib/upload"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBanner(formData: FormData) {
  const title = formData.get("title") as string
  const subtitle = formData.get("subtitle") as string
  const link = formData.get("link") as string
  const type = formData.get("type") as string || "hero"
  const isActive = formData.get("isActive") === "on"
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0

  const file = formData.get("image") as File
  if (!file?.size) return

  const image = await uploadFile(file, "banners")
  await prisma.banner.create({ data: { title: title || null, subtitle: subtitle || null, image, link: link || null, type, isActive, sortOrder } })
  revalidatePath("/admin/banners")
  redirect("/admin/banners")
}

export async function updateBanner(id: string, formData: FormData) {
  const banner = await prisma.banner.findUnique({ where: { id } })
  if (!banner) return

  const title = formData.get("title") as string
  const subtitle = formData.get("subtitle") as string
  const link = formData.get("link") as string
  const type = formData.get("type") as string || "hero"
  const isActive = formData.get("isActive") === "on"
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0

  let image = banner.image
  const file = formData.get("image") as File
  if (file?.size > 0) {
    await deleteFile(image)
    image = await uploadFile(file, "banners")
  }

  await prisma.banner.update({
    where: { id },
    data: { title: title || null, subtitle: subtitle || null, image, link: link || null, type, isActive, sortOrder },
  })
  revalidatePath("/admin/banners")
  redirect("/admin/banners")
}

export async function deleteBanner(id: string) {
  const banner = await prisma.banner.findUnique({ where: { id } })
  if (banner?.image) await deleteFile(banner.image)
  await prisma.banner.delete({ where: { id } })
  revalidatePath("/admin/banners")
}
