const globalForPrisma = globalThis as unknown as {
  prisma?: any
}

function createPrisma(): any {
  try {
    const { PrismaClient } = require("@prisma/client")
    const url = process.env.DATABASE_URL

    if (url && !url.includes("placeholder")) {
      try {
        const { PrismaNeon } = require("@prisma/adapter-neon")
        const adapter = new PrismaNeon({ connectionString: url })
        return new PrismaClient({ adapter })
      } catch {}
    }

    try {
      const path = require("path")
      const { PrismaLibSql } = require("@prisma/adapter-libsql")
      const dbPath = path.resolve(process.cwd(), "dev.db")
      const adapter = new PrismaLibSql({ url: `file://${dbPath}` })
      return new PrismaClient({ adapter })
    } catch {}

    return undefined
  } catch {
    return undefined
  }
}

function createMockPrisma() {
  const handler = {
    get(_: any, model: string) {
      return new Proxy({}, {
        get(__: any, method: string) {
          return (...args: any[]) => {
            if (method === "findMany" || method === "findUnique" || method === "count") return Promise.resolve([])
            if (method === "create" || method === "update" || method === "upsert" || method === "delete" || method === "deleteMany") return Promise.resolve({})
            if (method === "findFirst") return Promise.resolve(null)
            return Promise.resolve([])
          }
        }
      })
    }
  }
  return new Proxy({}, handler)
}

const client = globalForPrisma.prisma ?? createPrisma()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client

export const prisma = client ?? createMockPrisma()
