export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zahfa.store"

export const SITE_NAME = "Zahfa"

export const SITE_TAGLINE = "Busana Muslimah Modern & Syar'i"

export const SITE_DESCRIPTION =
  "Zahfa adalah toko busana muslimah modern di Indonesia. Temukan gamis, hijab, dress syar'i, dan aksesoris muslimah berkualitas dengan harga terjangkau."

export function absoluteUrl(path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL.replace(/\/$/, "")}${cleanPath}`
}
