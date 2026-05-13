"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { urlApi } from "@/lib/api-client"
import type { CreateUrlDto, UrlUpdateDto } from "@/lib/types"

export function useMyUrls() {
  return useQuery({
    queryKey: ["urls", "my"],
    queryFn: urlApi.getMyUrls,
  })
}

export function useAllUrls() {
  return useQuery({
    queryKey: ["urls", "all"],
    queryFn: urlApi.getAllUrls,
  })
}

export function useCreateUrl() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUrlDto) => urlApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] })
    },
  })
}

export function useCreateUrlWithApiKey(apiKey: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUrlDto) => urlApi.createWithApiKey(apiKey, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] })
    },
  })
}

export function useUpdateUrl() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UrlUpdateDto) => urlApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] })
    },
  })
}

export function useDeactivateUrl() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => urlApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] })
    },
  })
}

export function useDeleteUrl() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => urlApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] })
    },
  })
}
