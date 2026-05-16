"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"

const DEFAULT_SIZE = 20

export function usePagination() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const page = parseInt(searchParams.get("page") ?? "0", 10)
  const size = parseInt(searchParams.get("size") ?? String(DEFAULT_SIZE), 10)

  const setParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (key === "size" || key === "page") {
          params.set(key, value)
        }
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  const setPage = useCallback(
    (p: number) => setParams({ page: String(p) }),
    [setParams],
  )

  const setSize = useCallback(
    (s: number) => setParams({ size: String(s), page: "0" }),
    [setParams],
  )

  return { page, size, setPage, setSize }
}
