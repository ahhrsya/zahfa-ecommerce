import { hash } from "bcryptjs"

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
  // 1. Settings
  const settings = [
    { key: "STORE_NAME", value: "Zahfa" },
    { key: "STORE_DESC", value: "Toko Busana Muslimah Modern - Temukan koleksi busana muslimah terbaru dengan gaya modern dan syar'i" },
    { key: "STORE_ADDRESS", value: "Jl. Muslimah No. 123, Jakarta Selatan, DKI Jakarta 12345" },
    { key: "STORE_PHONE", value: "021-12345678" },
    { key: "STORE_EMAIL", value: "hello@zahfa.id" },
    { key: "WA_NUMBER", value: "6281234567890" },
  ]
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }

  // 2. Admin user
  const adminPassword = await hash("admin123", 12)
  await prisma.user.upsert({
    where: { email: "admin@zahfa.id" },
    update: {},
    create: {
      name: "Admin Zahfa",
      email: "admin@zahfa.id",
      password: adminPassword,
      role: "admin",
    },
  })

  // 3. Categories
  const categories = [
    { name: "Blouse", slug: "blouse", description: "Koleksi blouse muslimah modern", sortOrder: 1 },
    { name: "Tunik", slug: "tunik", description: "Tunik panjang elegan untuk berbagai acara", sortOrder: 2 },
    { name: "Long Dress", slug: "long-dress", description: "Gaun panjang syar'i yang anggun", sortOrder: 3 },
    { name: "Dress", slug: "dress", description: "Dress muslimah casual hingga formal", sortOrder: 4 },
    { name: "Cardigan", slug: "cardigan", description: "Cardigan dan outerwear wanita", sortOrder: 5 },
    { name: "Pashmina", slug: "pashmina", description: "Pashmina dan hijab segi empat", sortOrder: 6 },
    { name: "Celana", slug: "pants", description: "Celana panjang muslimah", sortOrder: 7 },
    { name: "Rok", slug: "skirt", description: "Rok panjang wanita", sortOrder: 8 },
    { name: "Setelan", slug: "matching-sets", description: "Setelan pasangan praktis", sortOrder: 9 },
    { name: "Tas", slug: "bag", description: "Tas dan aksesoris wanita", sortOrder: 10 },
  ]
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    })
  }

  // 4. Brands
  const brands = [
    { name: "Zahfa Signature", slug: "zahfa-signature", description: "Koleksi signature dari Zahfa", sortOrder: 1 },
    { name: "Nadjani", slug: "nadjani", description: "Brand fashion muslimah elegan", sortOrder: 2 },
    { name: "Tunique", slug: "tunique", description: "Tunik modern dengan sentuhan klasik", sortOrder: 3 },
    { name: "Beyza", slug: "beyza", description: "Fashion muslimah kekinian", sortOrder: 4 },
    { name: "Qirene", slug: "qirene", description: "Busana muslimah premium", sortOrder: 5 },
  ]
  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    })
  }

  // 5. Products
  const catMap = new Map<string, string>()
  for (const c of await prisma.category.findMany()) {
    catMap.set(c.slug, c.id)
  }
  const brandMap = new Map<string, string>()
  for (const b of await prisma.brand.findMany()) {
    brandMap.set(b.slug, b.id)
  }

  const products = [
    { name: "Blouse Zahra Floral", slug: "blouse-zahra-floral", description: "Blouse dengan motif floral yang elegan. Bahan katun premium yang adem dan nyaman dipakai sehari-hari. Cocok untuk acara formal maupun casual.", price: 185000, compareAtPrice: 250000, stock: 50, isFeatured: true, categorySlug: "blouse", brandSlug: "zahfa-signature" },
    { name: "Tunik Laila Premium", slug: "tunik-laila-premium", description: "Tunik panjang dengan bahan silk premium. Potongan loose dengan detail pleats di bagian depan. Sangat nyaman untuk acara formal.", price: 275000, compareAtPrice: 350000, stock: 30, isFeatured: true, categorySlug: "tunik", brandSlug: "nadjani" },
    { name: "Long Dress Aisha", slug: "long-dress-aisha", description: "Gaun panjang syar'i dengan cuttingan modern. Bahan crinkle yang tidak mudah kusut. Dilengkapi dengan belt untuk adjustable waist.", price: 425000, stock: 20, isFeatured: true, categorySlug: "long-dress", brandSlug: "tunique" },
    { name: "Dress Kazia Daily", slug: "dress-kazia-daily", description: "Dress casual yang nyaman untuk aktivitas sehari-hari. Bahan cotton stretch dengan variasi warna pastel.", price: 225000, stock: 45, isFeatured: false, categorySlug: "dress", brandSlug: "beyza" },
    { name: "Cardigan Lembut Hanin", slug: "cardigan-lembut-hanin", description: "Cardigan rajut lembut dengan bahan premium acrylic blend. Cocok sebagai outerwear untuk acara semi formal.", price: 195000, stock: 35, isFeatured: false, categorySlug: "cardigan", brandSlug: "qirene" },
    { name: "Pashmina Silk Bintan", slug: "pashmina-silk-bintan", description: "Pashmina silk premium dengan tekstur lembut dan ringan. Tersedia dalam berbagai pilihan warna elegan.", price: 145000, compareAtPrice: 200000, stock: 100, isFeatured: true, categorySlug: "pashmina", brandSlug: "zahfa-signature" },
    { name: "Celana Palazo Naura", slug: "celana-palazo-naura", description: "Celana palazo lebar yang nyaman dengan bahan flowy. Elastis di bagian pinggang untuk kenyamanan maksimal.", price: 165000, stock: 40, isFeatured: false, categorySlug: "pants", brandSlug: "nadjani" },
    { name: "Rok Plisket Rania", slug: "rok-plisket-rania", description: "Rok panjang dengan detail plisket yang manis. Bahan yang tidak mudah kusut dan nyaman dipakai seharian.", price: 175000, stock: 25, isFeatured: false, categorySlug: "skirt", brandSlug: "beyza" },
    { name: "Setelan Mira Casual", slug: "setelan-mira-casual", description: "Setelan atasan + bawahan yang serasi. Praktis untuk acara formal maupun semi formal.", price: 385000, stock: 15, isFeatured: true, categorySlug: "matching-sets", brandSlug: "tunique" },
    { name: "Blouse Basic Khadija", slug: "blouse-basic-khadija", description: "Blouse basic yang wajib ada di wardrobe setiap muslimah. Bahan katun jersey yang elastis dan nyaman.", price: 135000, stock: 60, isFeatured: false, categorySlug: "blouse", brandSlug: "qirene" },
    { name: "Tunik Elsya Modern", slug: "tunik-elsya-modern", description: "Tunik modern dengan kombinasi warna kontras. Detail kancing di bagian depan menambah kesan elegan.", price: 255000, stock: 25, isFeatured: false, categorySlug: "tunik", brandSlug: "zahfa-signature" },
    { name: "Long Dress Syar'i Medina", slug: "long-dress-syari-medina", description: "Long dress syar'i dengan potongan longgar dan bahan adem. Cocok untuk acara formal dan pengajian.", price: 395000, stock: 20, isFeatured: false, categorySlug: "long-dress", brandSlug: "nadjani" },
    { name: "Dress Aluna Floral", slug: "dress-aluna-floral", description: "Dress dengan motif floral lembut dan warna-warna pastel. Bahan katun yang adem dan ramah kulit.", price: 245000, compareAtPrice: 320000, stock: 30, isFeatured: false, categorySlug: "dress", brandSlug: "zahfa-signature" },
    { name: "Cardigan Syar'i Zafira", slug: "cardigan-syari-zafira", description: "Cardigan panjang syar'i dengan bahan jersey premium. Nyaman dipakai sebagai outer maupun atasan.", price: 215000, stock: 35, isFeatured: false, categorySlug: "cardigan", brandSlug: "beyza" },
    { name: "Tunik Batik Elegan", slug: "tunik-batik-elegan", description: "Tunik dengan motif batik modern. Perpaduan budaya Indonesia dengan fashion muslimah masa kini.", price: 295000, stock: 20, isFeatured: false, categorySlug: "tunik", brandSlug: "qirene" },
  ]

  for (const p of products) {
    const categoryId = catMap.get(p.categorySlug)
    const brandId = brandMap.get(p.brandSlug)
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        stock: p.stock,
        isFeatured: p.isFeatured,
        isActive: true,
        categoryId: categoryId ?? null,
        brandId: brandId ?? null,
      },
    })
    // Add product image
    await prisma.productImage.deleteMany({ where: { productId: product.id } })
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `/uploads/products/${p.slug}.png`,
        alt: p.name,
        sortOrder: 0,
      },
    })
  }

  // 6. Banners
  const banners = [
    { title: "New Collection 2025", subtitle: "Temukan gaya baru Anda dengan koleksi terbaru Zahfa", type: "hero", sortOrder: 1, image: "/uploads/banners/hero1.png" },
    { title: "Diskon Spesial", subtitle: "Potongan harga hingga 50% untuk koleksi tertentu", type: "hero", sortOrder: 2, image: "/uploads/banners/hero2.png" },
    { title: "Zahfa Signature", subtitle: "Koleksi eksklusif dari brand signature kami", type: "brand", sortOrder: 1, image: "/uploads/banners/brand1.png" },
    { title: "Pashmina Collection", subtitle: "Lengkap dengan berbagai warna pashmina silk", type: "category", sortOrder: 1, image: "/uploads/banners/cat1.png" },
  ]
  for (const b of banners) {
    await prisma.banner.create({ data: b })
  }

  // 7. Category images
  await prisma.category.updateMany({ where: { slug: "blouse" }, data: { image: "/uploads/categories/blouse.png" } })
  await prisma.category.updateMany({ where: { slug: "tunik" }, data: { image: "/uploads/categories/tunik.png" } })
  await prisma.category.updateMany({ where: { slug: "long-dress" }, data: { image: "/uploads/categories/long-dress.png" } })
  await prisma.category.updateMany({ where: { slug: "dress" }, data: { image: "/uploads/categories/dress.png" } })

  // 8. Blog posts
  const blogPosts = [
    {
      title: "6 Inspirasi OOTD Hijab untuk Kondangan",
      slug: "inspirasi-ootd-hijab-untuk-kondangan",
      content: `<p>Menghadiri acara kondangan atau resepsi pernikahan tentu membutuhkan outfit spesial. Berikut 6 inspirasi OOTD hijab yang bisa Anda coba:</p><h2>1. Long Dress Elegan</h2><p>Long dress dengan bahan brokat atau payet akan membuat Anda tampil memukau di acara kondangan. Pilih warna pastel seperti dusty pink, sage green, atau baby blue.</p><h2>2. Tunik + Rok Plisket</h2><p>Kombinasi tunik panjang dengan rok plisket memberikan kesan anggun dan modern. Tambahkan belt untuk mempertegas pinggang.</p><h2>3. Setelan Brokat</h2><p>Setelan brokat dengan cuttingan modern sangat cocok untuk acara formal. Padukan dengan hijab pashmina silk.</p><h2>4. Blouse + Palazo</h2><p>Tampil casual-elegant dengan blouse dan celana palazo lebar. Pilih warna monokrom untuk kesan mewah.</p><h2>5. Dress A-line</h2><p>Dress dengan potongan A-line sangat flattering untuk segala bentuk tubuh. Tambahkan outer cardigan untuk tampilan lebih sopan.</p><h2>6. Gamis Modern</h2><p>Gamis dengan detail modern seperti belt, pleats, atau puff sleeves bisa jadi pilihan aman untuk kondangan.</p>`,
      excerpt: "Inspirasi outfit hijab untuk menghadiri acara kondangan atau resepsi pernikahan.",
      image: "/uploads/blogs/fashion.png",
      author: "Tim Zahfa",
      isActive: true,
    },
    {
      title: "5 Model Tunik Terbaru yang Wajib Ada di Lemari",
      slug: "model-tunik-terbaru-wajib-ada",
      content: `<p>Tunik menjadi salah satu item fashion yang wajib dimiliki setiap muslimah. Selain nyaman, tunik juga versatile untuk berbagai acara. Berikut 5 model tunik terbaru yang wajib ada di lemari Anda:</p><h2>1. Tunik Peplum</h2><p>Tunik dengan detail peplum di bagian pinggang memberikan siluet yang elegan dan feminin.</p><h2>2. Tunik Layering</h2><p>Tunik dengan desain layering atau berlapis memberikan kesan modern dan unik.</p><h2>3. Tunik Kancing Depan</h2><p>Tunik dengan deretan kancing di bagian depan memudahkan Anda dalam mengenakannya sekaligus menambah detail estetik.</p><h2>4. Tunik Aksen Ruffle</h2><p>Detail ruffle di bagian lengan atau kerah memberikan sentuhan manis dan feminin.</p><h2>5. Tunik Asimetris</h2><p>Potongan asimetris memberikan tampilan yang edgy dan tidak membosankan.</p>`,
      excerpt: "Rekomendasi model tunik terbaru yang wajib ada di lemari setiap muslimah.",
      image: "/uploads/blogs/tunik.png",
      author: "Tim Zahfa",
      isActive: true,
    },
    {
      title: "Padu Padan Warna Hijab untuk Outfit Harian",
      slug: "padu-padan-warna-hijab-outfit-harian",
      content: `<p>Bingung memilih warna hijab yang cocok dengan outfit harian Anda? Berikut panduan padu padan warna hijab untuk berbagai outfit:</p><h2>1. Monokrom Classic</h2><p>Padukan hijab senada dengan outfit. Misal: outfit cream + hijab cream. Beri aksen dengan aksesoris warna kontras.</p><h2>2. Tone on Tone</h2><p>Pilih hijab dengan tone warna yang sama namun berbeda shade. Misal: outfit dusty pink + hijab baby pink.</p><h2>3. Kontras Netral</h2><p>Untuk outfit warna netral, Anda bisa bermain dengan hijab warna cerah seperti maroon, emerald, atau mustard.</p><h2>4. Warna Earth Tone</h2><p>Warna-warna earth tone seperti coklat, krem, olive, dan terracotta sangat cocok dipadukan satu sama lain.</p><h2>5. Pastel Harmony</h2><p>Paduan warna pastel seperti lavender, mint, baby blue, dan peach menciptakan tampilan yang lembut dan manis.</p>`,
      excerpt: "Tips padu padan warna hijab dengan outfit harian untuk tampilan yang lebih stylish.",
      image: "/uploads/blogs/ootd.png",
      author: "Tim Zahfa",
      isActive: true,
    },
  ]
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }

  console.log("✅ Seed data berhasil dibuat!")
  console.log("👤 Admin login: admin@zahfa.id / admin123")
  console.log(`📦 ${products.length} produk telah ditambahkan`)
  console.log(`📂 ${categories.length} kategori telah ditambahkan`)
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
