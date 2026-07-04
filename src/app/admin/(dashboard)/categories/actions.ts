'use server'

import { prisma } from "@/lib/prisma"
import { uploadFile, deleteFile } from "@/lib/upload"
import { generateSlug } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const isActive = formData.get("isActive") === "on"
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0
  const slug = generateSlug(name)

  let image: string | null = null
  const file = formData.get("image") as File
  if (file?.size > 0) {
    image = await uploadFile(file, "categories")
  }

  await prisma.category.create({ data: { name, slug, description, image, isActive, sortOrder } })
  revalidatePath("/admin/categories")
  redirect("/admin/categories")
}

export async function updateCategory(id: string, formData: FormData) {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) return

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const isActive = formData.get("isActive") === "on"
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0
  const slug = generateSlug(name)

  let image = category.image
  const file = formData.get("image") as File
  if (file?.size > 0) {
    if (image) await deleteFile(image)
    image = await uploadFile(file, "categories")
  }

  await prisma.category.update({
    where: { id },
    data: { name, slug, description, image, isActive, sortOrder },
  })
  revalidatePath("/admin/categories")
  redirect("/admin/categories")
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({ where: { id } })
  if (category?.image) await deleteFile(category.image)
  await prisma.category.delete({ where: { id } })
  revalidatePath("/admin/categories")
}
