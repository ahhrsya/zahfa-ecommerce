import { writeFile, mkdir } from "fs/promises"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads")

export async function uploadFile(
  file: File,
  subfolder: string = "general"
): Promise<string> {
  // Use Vercel Blob if token is configured
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob")
    const ext = file.name.split(".").pop()
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
    const blob = await put(`${subfolder}/${filename}`, file, { access: "public" })
    return blob.url
  }

  // Fallback: local filesystem (for development)
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const dir = path.join(UPLOAD_DIR, subfolder)
  await mkdir(dir, { recursive: true })

  const ext = file.name.split(".").pop()
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
  const filepath = path.join(dir, filename)

  await writeFile(filepath, buffer)

  return `/uploads/${subfolder}/${filename}`
}

export async function deleteFile(url: string): Promise<void> {
  if (!url) return

  // Delete from Vercel Blob if it's a blob URL
  if (url.startsWith("https://") && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { del } = await import("@vercel/blob")
      await del(url)
    } catch {}
    return
  }

  // Delete from local filesystem
  try {
    const { unlink } = await import("fs/promises")
    const filepath = path.join(process.cwd(), "public", url)
    await unlink(filepath)
  } catch {}
}
