import { prisma } from "./prisma"
import crypto from "crypto"

export async function getApiKey(): Promise<string> {
  const setting = await prisma.setting.findUnique({ where: { key: "AI_API_KEY" } })
  if (setting?.value) return setting.value

  const newKey = `sk-zahfa-${crypto.randomBytes(24).toString("hex")}`
  await prisma.setting.upsert({
    where: { key: "AI_API_KEY" },
    update: { value: newKey },
    create: { key: "AI_API_KEY", value: newKey },
  })
  return newKey
}

export async function validateApiKey(token: string | null): Promise<boolean> {
  if (!token) return false
  const validKey = await getApiKey()
  return token === validKey
}
