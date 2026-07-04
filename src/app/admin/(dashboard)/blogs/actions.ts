'use server'

import { prisma } from "@/lib/prisma"
import { uploadFile, deleteFile } from "@/lib/upload"
import { generateSlug } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBlogPost(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const author = formData.get("author") as string
  const isActive = formData.get("isActive") === "on"
  const slug = generateSlug(title)

  let image: string | null = null
  const file = formData.get("image") as File
  if (file?.size > 0) {
    image = await uploadFile(file, "blogs")
  }

  await prisma.blogPost.create({ data: { title, slug, content, excerpt: excerpt || null, image, author: author || null, isActive } })
  revalidatePath("/admin/blogs")
  redirect("/admin/blogs")
}

export async function updateBlogPost(id: string, formData: FormData) {
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) return

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const author = formData.get("author") as string
  const isActive = formData.get("isActive") === "on"
  const slug = generateSlug(title)

  let image = post.image
  const file = formData.get("image") as File
  if (file?.size > 0) {
    if (image) await deleteFile(image)
    image = await uploadFile(file, "blogs")
  }

  await prisma.blogPost.update({
    where: { id },
    data: { title, slug, content, excerpt: excerpt || null, image, author: author || null, isActive },
  })
  revalidatePath("/admin/blogs")
  redirect("/admin/blogs")
}

export async function deleteBlogPost(id: string) {
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (post?.image) await deleteFile(post.image)
  await prisma.blogPost.delete({ where: { id } })
  revalidatePath("/admin/blogs")
}
