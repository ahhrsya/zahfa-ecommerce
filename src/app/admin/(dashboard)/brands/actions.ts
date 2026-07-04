'use server'

import { prisma } from "@/lib/prisma"
import { uploadFile, deleteFile } from "@/lib/upload"
import { generateSlug } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBrand(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const isActive = formData.get("isActive") === "on"
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0
  const slug = generateSlug(name)

  let logo: string | null = null
  const file = formData.get("logo") as File
  if (file?.size > 0) {
    logo = await uploadFile(file, "brands")
  }

  await prisma.brand.create({ data: { name, slug, logo, description, isActive, sortOrder } })
  revalidatePath("/admin/brands")
  redirect("/admin/brands")
}

export async function updateBrand(id: string, formData: FormData) {
  const brand = await prisma.brand.findUnique({ where: { id } })
  if (!brand) return

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const isActive = formData.get("isActive") === "on"
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0
  const slug = generateSlug(name)

  let logo = brand.logo
  const file = formData.get("logo") as File
  if (file?.size > 0) {
    if (logo) await deleteFile(logo)
    logo = await uploadFile(file, "brands")
  }

  await prisma.brand.update({ where: { id }, data: { name, slug, logo, description, isActive, sortOrder } })
  revalidatePath("/admin/brands")
  redirect("/admin/brands")
}

export async function deleteBrand(id: string) {
  const brand = await prisma.brand.findUnique({ where: { id } })
  if (brand?.logo) await deleteFile(brand.logo)
  await prisma.brand.delete({ where: { id } })
  revalidatePath("/admin/brands")
}
