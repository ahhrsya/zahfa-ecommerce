export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zahfa.store"

export const SITE_NAME = "Zahfa"

export const SITE_TAGLINE = "Fashion Wanita Modern & Elegan"

export const SITE_DESCRIPTION =
  "Zahfa adalah destinasi fashion wanita modern di Indonesia. Temukan gamis, hijab, dress, dan aksesoris wanita berkualitas dengan harga terjangkau."

export function absoluteUrl(path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL.replace(/\/$/, "")}${cleanPath}`
}
