import { writeFile, mkdir } from "fs/promises"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads")

export async function uploadFile(
  file: File,
  subfolder: string = "general"
): Promise<string> {
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
  const filepath = path.join(process.cwd(), "public", url)
  try {
    const { unlink } = await import("fs/promises")
    await unlink(filepath)
  } catch {
    // file doesn't exist
  }
}
