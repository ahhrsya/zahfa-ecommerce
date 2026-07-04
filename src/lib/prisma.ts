const globalForPrisma = globalThis as unknown as {
  prisma?: any
}

function createPrisma(): any {
  const { PrismaClient } = require("@prisma/client")
  const url = process.env.DATABASE_URL

  if (url && !url.includes("placeholder")) {
    try {
      const { PrismaNeon } = require("@prisma/adapter-neon")
      return new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) })
    } catch {}
  }

  try {
    const path = require("path")
    const { PrismaLibSql } = require("@prisma/adapter-libsql")
    return new PrismaClient({
      adapter: new PrismaLibSql({ url: `file://${path.resolve(process.cwd(), "dev.db")}` }),
    })
  } catch {}

  const handler = {
    get(_: any, prop: string) {
      return () => []
    },
  }
  return new Proxy({}, handler)
}

export const prisma: any = globalForPrisma.prisma ?? createPrisma()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
