import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils"
import { validateApiKey } from "@/lib/api-key"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  const auth = request.headers.get("authorization")?.replace("Bearer ", "") || null
  if (!(await validateApiKey(auth))) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action, id, data } = body

    switch (action) {
      case "list": {
        const posts = await prisma.blogPost.findMany({
          where: data?.filter || {},
          orderBy: { createdAt: "desc" },
        })
        return NextResponse.json({ success: true, data: posts })
      }

      case "get": {
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
        const post = await prisma.blogPost.findUnique({ where: { id } })
        if (!post) return NextResponse.json({ error: "Blog not found" }, { status: 404 })
        return NextResponse.json({ success: true, data: post })
      }

      case "create": {
        if (!data?.title || !data?.content) {
          return NextResponse.json({ error: "title and content are required" }, { status: 400 })
        }
        const slug = generateSlug(data.title)
        const post = await prisma.blogPost.create({
          data: {
            title: data.title,
            slug: data.slug || slug,
            content: data.content,
            excerpt: data.excerpt || null,
            image: data.image || null,
            author: data.author || "Hermes AI",
            isActive: data.isActive !== false,
          },
        })
        revalidatePath("/", "layout")
        return NextResponse.json({ success: true, data: post })
      }

      case "update": {
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
        const existing = await prisma.blogPost.findUnique({ where: { id } })
        if (!existing) return NextResponse.json({ error: "Blog not found" }, { status: 404 })

        const updateData: any = {}
        if (data.title !== undefined) { updateData.title = data.title; updateData.slug = generateSlug(data.title) }
        if (data.content !== undefined) updateData.content = data.content
        if (data.excerpt !== undefined) updateData.excerpt = data.excerpt
        if (data.image !== undefined) updateData.image = data.image
        if (data.author !== undefined) updateData.author = data.author
        if (data.isActive !== undefined) updateData.isActive = data.isActive

        const post = await prisma.blogPost.update({ where: { id }, data: updateData })
        revalidatePath("/", "layout")
        return NextResponse.json({ success: true, data: post })
      }

      case "delete": {
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
        await prisma.blogPost.delete({ where: { id } })
        revalidatePath("/", "layout")
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
