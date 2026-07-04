import type { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createClient(): PrismaClient {
  const { PrismaClient } = require("@prisma/client") as typeof import("@prisma/client")

  if (process.env.DATABASE_URL && process.env.DATABASE_URL !== "postgresql://placeholder") {
    const { PrismaNeon } = require("@prisma/adapter-neon")
    const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
    return new PrismaClient({ adapter })
  }

  const path = require("path")
  const { PrismaLibSql } = require("@prisma/adapter-libsql")
  const dbPath = path.resolve(process.cwd(), "dev.db")
  const adapter = new PrismaLibSql({ url: `file://${dbPath}` })
  return new PrismaClient({ adapter })
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
