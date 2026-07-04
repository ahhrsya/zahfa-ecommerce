import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import path from "path"

const isDev = process.env.NODE_ENV !== "production"

function createAdapter() {
  if (isDev || !process.env.DATABASE_URL) {
    const dbPath = path.resolve(process.cwd(), "dev.db")
    return new PrismaLibSql({ url: `file://${dbPath}` })
  }
  return new PrismaLibSql({ url: process.env.DATABASE_URL })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: createAdapter() })

if (isDev) globalForPrisma.prisma = prisma
