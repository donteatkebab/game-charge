// lib/strapi-fetch.ts
import { cookies } from "next/headers"
import qs from "qs"

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL!

type StrapiFetchOptions = {
  url: string
  qs?: Record<string, any>
  auth?: boolean
  revalidate?: number
}

export async function strapiFetch<T>(
  url: string,
  {
    qs: query,
    auth = false,
    revalidate = 0,
  }: Omit<StrapiFetchOptions, "url"> = {}
): Promise<T> {
  const queryString = query
    ? `?${qs.stringify(query, { encodeValuesOnly: true })}`
    : ""

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (auth) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) throw new Error("Unauthorized")
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${STRAPI_URL}/api/${url}${queryString}`, {
    headers,
    next: { revalidate },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || "Strapi fetch failed")
  }

  return res.json()
}