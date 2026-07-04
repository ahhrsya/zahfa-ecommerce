import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils"
import { validateApiKey } from "@/lib/api-key"
import { revalidatePath } from "next/cache"
import { SITE_URL } from "@/lib/site"

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
        const products = await prisma.product.findMany({
          where: data?.filter || {},
          orderBy: { createdAt: "desc" },
          include: { images: { take: 1 }, category: { select: { name: true, slug: true } } },
        })
        return NextResponse.json({ success: true, data: products })
      }

      case "get": {
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
        const product = await prisma.product.findUnique({
          where: { id },
          include: { images: true, variants: true, category: true, brand: true },
        })
        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })
        return NextResponse.json({ success: true, data: product })
      }

      case "create": {
        if (!data?.name) return NextResponse.json({ error: "name is required" }, { status: 400 })
        const slug = generateSlug(data.name)
        const product = await prisma.product.create({
          data: {
            name: data.name,
            slug: data.slug || slug,
            description: data.description || null,
            price: parseFloat(data.price) || 0,
            compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
            stock: parseInt(data.stock) || 0,
            isActive: data.isActive !== false,
            isFeatured: data.isFeatured === true,
            categoryId: data.categoryId || null,
            brandId: data.brandId || null,
          },
        })
        if (data.images?.length) {
          await prisma.productImage.createMany({
            data: data.images.map((url: string, i: number) => ({
              productId: product.id,
              url,
              alt: data.name,
              sortOrder: i,
            })),
          })
        }
        revalidatePath("/", "layout")
        return NextResponse.json({ success: true, data: product })
      }

      case "update": {
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
        const existing = await prisma.product.findUnique({ where: { id } })
        if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 })

        const updateData: any = {}
        if (data.name !== undefined) { updateData.name = data.name; updateData.slug = generateSlug(data.name) }
        if (data.description !== undefined) updateData.description = data.description
        if (data.price !== undefined) updateData.price = parseFloat(data.price)
        if (data.compareAtPrice !== undefined) updateData.compareAtPrice = data.compareAtPrice ? parseFloat(data.compareAtPrice) : null
        if (data.stock !== undefined) updateData.stock = parseInt(data.stock)
        if (data.isActive !== undefined) updateData.isActive = data.isActive
        if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured
        if (data.categoryId !== undefined) updateData.categoryId = data.categoryId || null
        if (data.brandId !== undefined) updateData.brandId = data.brandId || null

        const product = await prisma.product.update({ where: { id }, data: updateData })
        revalidatePath("/", "layout")
        return NextResponse.json({ success: true, data: product })
      }

      case "delete": {
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
        await prisma.product.delete({ where: { id } })
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
