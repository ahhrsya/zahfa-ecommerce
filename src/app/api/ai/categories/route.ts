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
        const categories = await prisma.category.findMany({
          orderBy: { sortOrder: "asc" },
        })
        return NextResponse.json({ success: true, data: categories })
      }

      case "create": {
        if (!data?.name) return NextResponse.json({ error: "name is required" }, { status: 400 })
        const slug = generateSlug(data.name)
        const category = await prisma.category.create({
          data: {
            name: data.name,
            slug: data.slug || slug,
            description: data.description || null,
            image: data.image || null,
            isActive: data.isActive !== false,
            sortOrder: data.sortOrder || 0,
          },
        })
        revalidatePath("/", "layout")
        return NextResponse.json({ success: true, data: category })
      }

      case "update": {
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
        const existing = await prisma.category.findUnique({ where: { id } })
        if (!existing) return NextResponse.json({ error: "Category not found" }, { status: 404 })

        const updateData: any = {}
        if (data.name !== undefined) { updateData.name = data.name; updateData.slug = generateSlug(data.name) }
        if (data.description !== undefined) updateData.description = data.description
        if (data.image !== undefined) updateData.image = data.image
        if (data.isActive !== undefined) updateData.isActive = data.isActive
        if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder

        const category = await prisma.category.update({ where: { id }, data: updateData })
        revalidatePath("/", "layout")
        return NextResponse.json({ success: true, data: category })
      }

      case "delete": {
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
        await prisma.category.delete({ where: { id } })
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
