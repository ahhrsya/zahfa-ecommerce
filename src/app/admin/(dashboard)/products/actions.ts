'use server'

import { prisma } from "@/lib/prisma"
import { uploadFile, deleteFile } from "@/lib/upload"
import { generateSlug } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const compareAtPrice = formData.get("compareAtPrice") ? parseFloat(formData.get("compareAtPrice") as string) : null
  const stock = parseInt(formData.get("stock") as string) || 0
  const isActive = formData.get("isActive") === "on"
  const isFeatured = formData.get("isFeatured") === "on"
  const categoryId = formData.get("categoryId") as string || null
  const brandId = formData.get("brandId") as string || null
  const slug = generateSlug(name)

  const product = await prisma.product.create({
    data: { name, slug, description, price, compareAtPrice, stock, isActive, isFeatured, categoryId, brandId },
  })

  const variantNames = formData.getAll("variantName") as string[]
  const variantTypes = formData.getAll("variantType") as string[]
  const variantPrices = formData.getAll("variantPrice") as string[]
  const variantStocks = formData.getAll("variantStock") as string[]

  for (let i = 0; i < variantNames.length; i++) {
    if (variantNames[i]) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: variantNames[i],
          type: variantTypes[i] || "size",
          price: variantPrices[i] ? parseFloat(variantPrices[i]) : null,
          stock: parseInt(variantStocks[i]) || 0,
          sortOrder: i,
        },
      })
    }
  }

  const images = formData.getAll("images") as File[]
  for (let i = 0; i < images.length; i++) {
    if (images[i].size > 0) {
      const url = await uploadFile(images[i], "products")
      const alt = formData.get(`imageAlt_${i}`) as string
      await prisma.productImage.create({
        data: { productId: product.id, url, alt: alt || null, sortOrder: i },
      })
    }
  }

  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const compareAtPrice = formData.get("compareAtPrice") ? parseFloat(formData.get("compareAtPrice") as string) : null
  const stock = parseInt(formData.get("stock") as string) || 0
  const isActive = formData.get("isActive") === "on"
  const isFeatured = formData.get("isFeatured") === "on"
  const categoryId = formData.get("categoryId") as string || null
  const brandId = formData.get("brandId") as string || null
  const slug = generateSlug(name)

  await prisma.product.update({
    where: { id },
    data: { name, slug, description, price, compareAtPrice, stock, isActive, isFeatured, categoryId, brandId },
  })

  await prisma.productVariant.deleteMany({ where: { productId: id } })
  const variantNames = formData.getAll("variantName") as string[]
  const variantTypes = formData.getAll("variantType") as string[]
  const variantPrices = formData.getAll("variantPrice") as string[]
  const variantStocks = formData.getAll("variantStock") as string[]

  for (let i = 0; i < variantNames.length; i++) {
    if (variantNames[i]) {
      await prisma.productVariant.create({
        data: {
          productId: id,
          name: variantNames[i],
          type: variantTypes[i] || "size",
          price: variantPrices[i] ? parseFloat(variantPrices[i]) : null,
          stock: parseInt(variantStocks[i]) || 0,
          sortOrder: i,
        },
      })
    }
  }

  const images = formData.getAll("images") as File[]
  for (let i = 0; i < images.length; i++) {
    if (images[i].size > 0) {
      const url = await uploadFile(images[i], "products")
      const alt = formData.get(`imageAlt_${i}`) as string
      await prisma.productImage.create({
        data: { productId: id, url, alt: alt || null, sortOrder: i },
      })
    }
  }

  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function deleteProduct(id: string) {
  const images = await prisma.productImage.findMany({ where: { productId: id } })
  for (const img of images) {
    await deleteFile(img.url)
  }
  await prisma.product.delete({ where: { id } })
  revalidatePath("/admin/products")
}

export async function toggleProductStatus(id: string, isActive: boolean) {
  await prisma.product.update({ where: { id }, data: { isActive } })
  revalidatePath("/admin/products")
}
