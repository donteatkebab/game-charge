
export function strapiMediaUrl(url?: string | null) {
  if (!url) return null
  if (url.startsWith("http://") || url.startsWith("https://")) return url

  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  if (!baseUrl) return url

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
  const normalizedPath = url.startsWith("/") ? url : `/${url}`
  return `${normalizedBase}${normalizedPath}`
}
