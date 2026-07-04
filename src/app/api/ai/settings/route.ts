import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateApiKey } from "@/lib/api-key"

export async function GET(request: Request) {
  const auth = request.headers.get("authorization")?.replace("Bearer ", "") || null
  if (!(await validateApiKey(auth))) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
  }

  try {
    const settings = await prisma.setting.findMany()
    const map: Record<string, string> = {}
    settings.forEach((s) => { map[s.key] = s.value })

    return NextResponse.json({
      success: true,
      data: {
        storeName: map.STORE_NAME || "",
        storeDescription: map.STORE_DESC || "",
        storeAddress: map.STORE_ADDRESS || "",
        storePhone: map.STORE_PHONE || "",
        storeEmail: map.STORE_EMAIL || "",
        waNumber: map.WA_NUMBER || "",
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
