import { NextResponse } from "next/server"
import { sendContactNotification, sendContactAutoReply } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const name = form.get("name") as string
    const email = form.get("email") as string
    const phone = (form.get("phone") as string) || ""
    const message = form.get("message") as string

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    await Promise.all([
      sendContactNotification({ name, email, phone, message }),
      sendContactAutoReply({ name, email }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
