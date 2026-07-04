let prisma: any

if (process.env.DATABASE_URL) {
  const { PrismaClient } = await import("@prisma/client")
  const { PrismaNeon } = await import("@prisma/adapter-neon")
  const { Pool } = await import("@neondatabase/serverless")
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaNeon(pool)
  prisma = new PrismaClient({ adapter })
} else {
  const { PrismaClient } = await import("@prisma/client")
  const { PrismaLibSql } = await import("@prisma/adapter-libsql")
  const path = await import("path")
  const dbPath = path.resolve(process.cwd(), "dev.db")
  const adapter = new PrismaLibSql({ url: `file://${dbPath}` })
  prisma = new PrismaClient({ adapter })
}

async function main() {
  // 1. Update product images
  const productImages = [
    { slug: "blouse-zahra-floral", file: "blouse-zahra-floral.png" },
    { slug: "tunik-laila-premium", file: "tunik-laila-premium.png" },
    { slug: "long-dress-aisha", file: "long-dress-aisha.png" },
    { slug: "dress-kazia-daily", file: "dress-kazia-daily.png" },
    { slug: "cardigan-lembut-hanin", file: "cardigan-lembut-hanin.png" },
    { slug: "pashmina-silk-bintan", file: "pashmina-silk-bintan.png" },
    { slug: "celana-palazo-naura", file: "celana-palazo-naura.png" },
    { slug: "rok-plisket-rania", file: "rok-plisket-rania.png" },
    { slug: "setelan-mira-casual", file: "setelan-mira-casual.png" },
    { slug: "blouse-basic-khadija", file: "blouse-basic-khadija.png" },
    { slug: "tunik-elsya-modern", file: "tunik-elsya-modern.png" },
    { slug: "long-dress-syari-medina", file: "long-dress-syari-medina.png" },
    { slug: "dress-aluna-floral", file: "dress-aluna-floral.png" },
    { slug: "cardigan-syari-zafira", file: "cardigan-syari-zafira.png" },
    { slug: "tunik-batik-elegan", file: "tunik-batik-elegan.png" },
  ]

  for (const pi of productImages) {
    const product = await prisma.product.findUnique({ where: { slug: pi.slug } })
    if (!product) {
      console.log(`  ⚠️  Product not found: ${pi.slug}`)
      continue
    }
    // Delete existing images
    await prisma.productImage.deleteMany({ where: { productId: product.id } })
    // Add new image
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `/uploads/products/${pi.file}`,
        alt: product.name,
        sortOrder: 0,
      },
    })
    console.log(`  ✅ ${product.name} → ${pi.file}`)
  }

  // 2. Update banners
  const banners = [
    { id: "hero1", image: "/uploads/banners/hero1.png" },
    { id: "hero2", image: "/uploads/banners/hero2.png" },
    { id: "brand1", image: "/uploads/banners/brand1.png" },
    { id: "cat1", image: "/uploads/banners/cat1.png" },
  ]
  const allBanners = await prisma.banner.findMany()
  for (let i = 0; i < Math.min(banners.length, allBanners.length); i++) {
    await prisma.banner.update({
      where: { id: allBanners[i].id },
      data: { image: banners[i].image },
    })
    console.log(`  ✅ Banner ${i + 1} → ${banners[i].image}`)
  }

  // 3. Update categories
  const catImages = [
    { slug: "blouse", file: "blouse.png" },
    { slug: "tunik", file: "tunik.png" },
    { slug: "long-dress", file: "long-dress.png" },
    { slug: "dress", file: "dress.png" },
  ]
  for (const ci of catImages) {
    await prisma.category.updateMany({
      where: { slug: ci.slug },
      data: { image: `/uploads/categories/${ci.file}` },
    })
    console.log(`  ✅ Category ${ci.slug} → ${ci.file}`)
  }

  // 4. Update blog posts
  const blogs = [
    { slug: "inspirasi-ootd-hijab-untuk-kondangan", image: "/uploads/blogs/fashion.png" },
    { slug: "model-tunik-terbaru-wajib-ada", image: "/uploads/blogs/tunik.png" },
    { slug: "padu-padan-warna-hijab-outfit-harian", image: "/uploads/blogs/ootd.png" },
  ]
  for (const b of blogs) {
    await prisma.blogPost.updateMany({
      where: { slug: b.slug },
      data: { image: b.image },
    })
    console.log(`  ✅ Blog ${b.slug} → ${b.image}`)
  }

  console.log("\n🎉 All assets updated!")
}

main()
  .catch((e) => {
    console.error("❌ Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
