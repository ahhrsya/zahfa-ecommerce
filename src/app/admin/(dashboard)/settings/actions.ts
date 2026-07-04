'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateSettings(formData: FormData) {
  const entries = formData.entries()
  for (const [key, value] of entries) {
    if (key.startsWith("$") || key === "submit") continue
    await prisma.setting.upsert({
      where: { key },
      update: { value: value as string },
      create: { key, value: value as string },
    })
  }
  revalidatePath("/admin/settings")
  revalidatePath("/", "layout")
}

const defaultKeys = ["WA_NUMBER", "STORE_NAME", "STORE_DESC", "STORE_ADDRESS", "STORE_PHONE", "STORE_EMAIL"]

export async function ensureDefaultSettings() {
  for (const key of defaultKeys) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value: "" },
    })
  }
}
