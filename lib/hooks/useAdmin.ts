"use client"

import { useQuery } from "@tanstack/react-query"
import { adminApi } from "@/lib/api-client"

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApi.getStats(),
    refetchInterval: 30_000,
  })
}
