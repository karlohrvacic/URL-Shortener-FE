export interface Authorities {
  id: number
  name: string
  active: boolean
}

export interface User {
  id: number
  name?: string
  email: string
  password?: string
  apiKeySlots: number
  authorities: Authorities[]
  createDate: string
  lastLogin: string
  active: boolean
  authProvider?: string
}

export interface UserDto {
  id: number
  name?: string
  email: string
  apiKeySlots: number
  authorities: Authorities[]
  createDate: string
  lastLogin: string
}

export interface Url {
  id: number
  longUrl: string
  shortUrl: string
  owner?: User
  apiKey?: ApiKey
  createDate: string
  lastAccessed?: string
  expirationDate?: string
  visits: number
  visitLimit: number
  lastSafeBrowsingCheck?: string
  platformType?: string
  threatType?: string
  active: boolean
}

/** New API response — slimmed down, no apiKey/internal fields */
export interface UrlResponse {
  id: number
  longUrl: string
  shortUrl: string
  createDate: string
  expirationDate?: string
  visits: number
  visitLimit: number
  active: boolean
  ownerEmail?: string
}

export interface ApiKey {
  id: number
  key: string
  owner: User
  apiCallsLimit: number
  apiCallsUsed: number
  createDate: string
  expirationDate?: string
  active: boolean
}

/** New API response — no urls field */
export interface ApiKeyResponse {
  id: number
  key: string
  apiCallsLimit: number
  apiCallsUsed: number
  createDate: string
  expirationDate?: string
  active: boolean
  ownerEmail?: string
}

export interface PeekUrl {
  longUrl: string
  shortUrl: string
  createDate: string
}

export interface JWTTokenDto {
  token: string
  user: UserDto
}

export interface LoginDto {
  email: string
  password: string
  rememberMe?: boolean
}

/** New API — name field removed */
export interface UserRegisterDto {
  email: string
  password: string
}

export interface CreateUrlDto {
  longUrl: string
  shortUrl?: string
  visitLimit?: number
  expirationDate?: string
}

export interface UrlUpdateDto {
  id: number
  visitLimit?: number
  expirationDate?: string
}

export interface ApiKeyUpdateDto {
  id: number
  apiCallsLimit?: number
  apiCallsUsed?: number
  expirationDate?: string
  active?: boolean
}

/** New API — name field removed */
export interface UserUpdateDto {
  id: number
  email?: string
  apiKeySlots?: number
  active?: boolean
}

export interface UpdatePasswordDto {
  oldPassword: string
  newPassword: string
}

export interface RequestPasswordResetDto {
  email: string
}

export interface PasswordResetDto {
  token: string
  email: string
  password: string
}

/** Link preview from OG/Twitter meta tags */
export interface LinkPreviewResponse {
  url: string
  title?: string
  description?: string
  imageUrl?: string
}

/** Generic paginated response (Spring Page<T>) */
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface AdminStatsResponse {
  totalUsers: number
  totalUrls: number
  activeUrls: number
  totalApiKeys: number
  appVersion: string
  uptime: string
  cacheActive: boolean
  databaseActive: boolean
  javaVersion: string
  serverTime: string
  recentUrls: RecentUrlItem[]
  cacheHitRatio: string
  activeProfiles: string[]
  jvmMemoryUsed: string
  jvmMemoryMax: string
  requestsCount: number
}

export interface RecentUrlItem {
  id: number
  shortUrl: string
  longUrl: string
  createDate: string
  visits: number
  ownerEmail?: string
}
