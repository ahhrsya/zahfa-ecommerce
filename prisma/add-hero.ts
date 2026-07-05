import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import path from "path"

const dbPath = path.resolve(process.cwd(), "dev.db")
const adapter = new PrismaLibSql({ url: `file://${dbPath}` })
const prisma = new PrismaClient({ adapter: adapter as any })

async function main() {
  const existing = await prisma.banner.findFirst({
    where: { image: "/uploads/banners/hero2.png" },
  })
  if (existing) {
    console.log("hero2 banner already exists")
    return
  }
  await prisma.banner.create({
    data: {
      title: "Koleksi Terbaru Zahfa",
      subtitle: "Tampil anggun dengan koleksi fashion wanita modern terbaru",
      image: "/uploads/banners/hero2.png",
      type: "hero",
      isActive: true,
      sortOrder: 1,
    },
  })
  console.log("hero2 banner created")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
