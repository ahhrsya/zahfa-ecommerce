import { NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-key"
import { SITE_NAME, SITE_URL } from "@/lib/site"

export async function GET(request: Request) {
  const auth = request.headers.get("authorization")?.replace("Bearer ", "") || null
  if (!(await validateApiKey(auth))) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
  }

  return NextResponse.json({
    name: SITE_NAME,
    url: SITE_URL,
    version: "1.0",
    endpoints: {
      products: {
        path: "/api/ai/products",
        methods: ["POST"],
        actions: ["list", "create", "update", "delete", "get"],
      },
      blogs: {
        path: "/api/ai/blogs",
        methods: ["POST"],
        actions: ["list", "create", "update", "delete", "get"],
      },
      categories: {
        path: "/api/ai/categories",
        methods: ["POST"],
        actions: ["list", "create", "update", "delete"],
      },
      settings: {
        path: "/api/ai/settings",
        methods: ["GET"],
        description: "Get store settings (name, address, wa number, email)",
      },
    },
    auth: "Bearer <api_key>",
  })
}
