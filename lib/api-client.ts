import { getApiBaseUrl } from "./utils"

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
  body?: unknown
): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const token = localStorage.getItem("auth-token")

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = token
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }))
    throw new ApiError(error.message || "Request failed", response.status)
  }

  if (response.status === 204) return {} as T

  return response.json()
}

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: import("./types").UserDto }>("POST", "/auth/login", data),
  register: (data: { name?: string; email: string; password: string }) =>
    request<string>("POST", "/auth/register", data),
  requestPasswordReset: (data: { email: string }) =>
    request<void>("POST", "/auth/reset-password", data),
  resetPassword: (data: { token: string; email: string; password: string }) =>
    request<import("./types").User>("POST", "/auth/reset-password/set-password", data),
}

// URL
export const urlApi = {
  create: (data: import("./types").CreateUrlDto) =>
    request<import("./types").Url>("POST", "/url/new", data),
  createWithApiKey: (apiKey: string, data: import("./types").CreateUrlDto) =>
    request<import("./types").Url>("POST", `/url/new/${apiKey}`, data),
  getMyUrls: () =>
    request<import("./types").Url[]>("GET", "/url/my"),
  getAllUrls: () =>
    request<import("./types").Url[]>("GET", "/url/all"),
  getByShort: (short: string) =>
    request<import("./types").Url>("GET", `/url/redirect/${short}`),
  peek: (short: string) =>
    request<import("./types").PeekUrl>("GET", `/url/peek/${short}`),
  update: (data: import("./types").UrlUpdateDto) =>
    request<import("./types").Url>("PUT", "/url", data),
  deactivate: (id: number) =>
    request<import("./types").Url>("GET", `/url/deactivate/${id}`),
  delete: (id: number) =>
    request<void>("GET", `/url/delete/${id}`),
}

// API Key
export const apiKeyApi = {
  generate: () =>
    request<import("./types").ApiKey>("GET", "/api-key/new"),
  getMyKeys: () =>
    request<import("./types").ApiKey[]>("GET", "/api-key/my"),
  getAllKeys: () =>
    request<import("./types").ApiKey[]>("GET", "/api-key"),
  update: (data: import("./types").ApiKeyUpdateDto) =>
    request<import("./types").ApiKey>("PUT", "/api-key", data),
  revoke: (id: number) =>
    request<import("./types").ApiKey>("GET", `/api-key/revoke/${id}`),
}

// User
export const userApi = {
  getMe: () =>
    request<import("./types").UserDto>("GET", "/user/me"),
  getAll: () =>
    request<import("./types").User[]>("GET", "/user/all"),
  update: (data: import("./types").UserUpdateDto) =>
    request<import("./types").User>("PUT", "/user", data),
  updatePassword: (data: import("./types").UpdatePasswordDto) =>
    request<import("./types").User>("PUT", "/user/update-password", data),
  delete: (id: number) =>
    request<void>("DELETE", `/user/${id}`),
}
