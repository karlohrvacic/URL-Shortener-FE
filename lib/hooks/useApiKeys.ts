"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiKeyApi } from "@/lib/api-client"
import type { ApiKeyUpdateDto } from "@/lib/types"

export function useMyApiKeys() {
  return useQuery({
    queryKey: ["apiKeys", "my"],
    queryFn: apiKeyApi.getMyKeys,
  })
}

export function useAllApiKeys() {
  return useQuery({
    queryKey: ["apiKeys", "all"],
    queryFn: apiKeyApi.getAllKeys,
  })
}

export function useGenerateApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiKeyApi.generate(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] })
    },
  })
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ApiKeyUpdateDto) => apiKeyApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] })
    },
  })
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiKeyApi.revoke(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] })
    },
  })
}
