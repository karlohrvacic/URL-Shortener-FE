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
}

export interface UserRegisterDto {
  name?: string
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

export interface UserUpdateDto {
  id: number
  name?: string
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
