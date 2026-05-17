"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"

const DEFAULT_SIZE = 20

export function usePagination() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10) || 0)
  const size = parseInt(searchParams.get("size") ?? String(DEFAULT_SIZE), 10) || DEFAULT_SIZE
  const sort = searchParams.get("sort") ?? "createDate"
  const order = searchParams.get("order") ?? "desc"

  const setParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        params.set(key, value)
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

  const toggleSort = useCallback(
    (field: string) => {
      const newOrder = sort === field && order === "asc" ? "desc" : "asc"
      setParams({ sort: field, order: newOrder, page: "0" })
    },
    [sort, order, setParams],
  )

  const sortDir = useCallback(
    (field: string) => sort === field ? order : null,
    [sort, order],
  )

  return { page, size, sort, order, setPage, setSize, toggleSort, sortDir }
}
