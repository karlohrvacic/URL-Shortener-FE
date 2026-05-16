import { getApiBaseUrl } from "./utils"
import type { UrlResponse, ApiKeyResponse, UserDto, User, PeekUrl, CreateUrlDto, UrlUpdateDto, ApiKeyUpdateDto, UserUpdateDto, UpdatePasswordDto, LinkPreviewResponse, Page, AdminStatsResponse, UrlFilters, UserFilters } from "./types"

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const token = localStorage.getItem("auth-token")

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    reqHeaders["Authorization"] = token
  }

  if (headers) {
    Object.assign(reqHeaders, headers)
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    // New API: { "error": "message" }, old API: { "message": "..." }
    const msg = body.error || body.message || "Request failed"
    throw new ApiError(msg, response.status)
  }

  if (response.status === 204 || response.status === 202) return {} as T

  return response.json()
}

// Auth
export const authApi = {
  login: (data: { email: string; password: string; rememberMe?: boolean }) =>
    request<{ token: string; user: UserDto }>("POST", "/auth/login", data),
  register: (data: { email: string; password: string }) =>
    request<string>("POST", "/auth/register", data),
  requestPasswordReset: (data: { email: string }) =>
    request<void>("POST", "/auth/password-reset", data),
  resetPassword: (data: { token: string; email: string; password: string }) =>
    request<User>("POST", "/auth/password-reset/confirm", data),
}

// URL
export const urlApi = {
  create: (data: CreateUrlDto, apiKey?: string) => {
    const headers = apiKey ? { "X-Api-Key": apiKey } : undefined
    return request<UrlResponse>("POST", "/urls", data, headers)
  },
  bulkCreate: (data: CreateUrlDto[]) =>
    request<UrlResponse[]>("POST", "/urls/bulk", data),
  getMyUrls: (filters: UrlFilters = {}, page = 0, size = 20) => {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("size", String(size))
    if (filters.search) params.set("search", filters.search)
    if (filters.active != null) params.set("active", String(filters.active))
    if (filters.expired) params.set("expired", "true")
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom)
    if (filters.dateTo) params.set("dateTo", filters.dateTo)
    return request<Page<UrlResponse>>("GET", `/urls?${params}`)
  },
  getAllUrls: (page = 0, size = 20) =>
    request<Page<UrlResponse>>("GET", `/urls/all?page=${page}&size=${size}`),
  getByShort: (short: string) =>
    request<UrlResponse>("GET", `/urls/${short}`),
  peek: (short: string) =>
    request<PeekUrl>("GET", `/urls/${short}/peek`),
  preview: (short: string) =>
    request<LinkPreviewResponse>("GET", `/urls/${short}/preview`),
  getQrCodeUrl: (short: string, size = 300) =>
    `${getApiBaseUrl()}/urls/${short}/qr?size=${size}`,
  update: (id: number, data: UrlUpdateDto) =>
    request<UrlResponse>("PUT", `/urls/${id}`, data),
  deactivate: (id: number) =>
    request<UrlResponse>("PATCH", `/urls/${id}/deactivate`),
  delete: (id: number) =>
    request<void>("DELETE", `/urls/${id}`),
  exportCsv: async () => {
    const baseUrl = getApiBaseUrl()
    const token = localStorage.getItem("auth-token")
    const response = await fetch(`${baseUrl}/urls/export`, {
      headers: token ? { "Authorization": token } : {},
    })
    if (!response.ok) throw new Error("Failed to export")
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "my-urls.csv"
    a.click()
    URL.revokeObjectURL(url)
  },
}

// API Key
export const apiKeyApi = {
  generate: () =>
    request<ApiKeyResponse>("POST", "/api-keys"),
  getMyKeys: () =>
    request<ApiKeyResponse[]>("GET", "/api-keys"),
  getAllKeys: (page = 0, size = 20) =>
    request<Page<ApiKeyResponse>>("GET", `/api-keys/all?page=${page}&size=${size}`),
  update: (id: number, data: ApiKeyUpdateDto) =>
    request<ApiKeyResponse>("PUT", `/api-keys/${id}`, data),
  revoke: (id: number) =>
    request<ApiKeyResponse>("PATCH", `/api-keys/${id}/revoke`),
}

// User
export const userApi = {
  getMe: () =>
    request<UserDto>("GET", "/users/me"),
  getAll: (filters: UserFilters = {}, page = 0, size = 20) => {
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("size", String(size))
    if (filters.search) params.set("search", filters.search)
    if (filters.active != null) params.set("active", String(filters.active))
    return request<Page<User>>("GET", `/users?${params}`)
  },
  update: (id: number, data: UserUpdateDto) =>
    request<User>("PUT", `/users/${id}`, data),
  updatePassword: (data: UpdatePasswordDto) =>
    request<User>("PATCH", "/users/password", data),
  delete: (id: number) =>
    request<void>("DELETE", `/users/${id}`),
}

// Admin
export const adminApi = {
  getStats: () =>
    request<AdminStatsResponse>("GET", "/admin/stats"),
  exportUrlsCsv: async () => {
    const baseUrl = getApiBaseUrl()
    const token = localStorage.getItem("auth-token")
    const response = await fetch(`${baseUrl}/admin/urls/export`, {
      headers: token ? { "Authorization": token } : {},
    })
    if (!response.ok) throw new Error("Failed to export")
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "all-urls.csv"
    a.click()
    URL.revokeObjectURL(url)
  },
}
