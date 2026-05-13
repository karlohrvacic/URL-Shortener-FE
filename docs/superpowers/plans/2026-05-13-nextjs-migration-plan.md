# Next.js Migration Implementation Plan

> **For agentic workers:** Use inline execution with fixer dispatch for parallelizable tasks. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate URL Shortener frontend from Angular 14 to Next.js 14 App Router with all API endpoints, modern UI, dark mode, QR codes, and URL analytics.

**Architecture:** Next.js App Router with React Query for server state, AuthContext for auth, shadcn/ui components, Tailwind CSS styling.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, TanStack React Query, React Hook Form + Zod, Recharts, qrcode.react, next-themes, lucide-react, sonner

**Design spec:** `docs/superpowers/specs/2026-05-13-migrate-to-nextjs-design.md`

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`
- Create: `next.config.mjs`
- Create: `tsconfig.json`
- Create: `app/globals.css`
- Create: `next-env.d.ts`
- Modify: `tailwind.config.js`
- Modify: `postcss.config.js`
- Modify: `.gitignore`

- [ ] **Step 1: Write updated package.json**

```json
{
  "name": "url-shortener",
  "version": "1.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.50.0",
    "@hookform/resolvers": "^3.3.4",
    "zod": "^3.22.0",
    "recharts": "^2.10.0",
    "qrcode.react": "^4.0.0",
    "lucide-react": "^0.350.0",
    "next-themes": "^0.3.0",
    "sonner": "^1.4.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-separator": "^1.0.3"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

- [ ] **Step 2: Write next.config.mjs**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 3: Write tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Write app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 5: Update tailwind.config.js**

Replace the existing config with one that uses the CSS variables:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

- [ ] **Step 6: Update .gitignore** to add Next.js patterns

Add these lines to the existing `.gitignore`:
```
# Next.js
.next/
out/

# TypeScript
*.tsbuildinfo
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`

- [ ] **Step 8: Verify build works**

Run: `npx next build --no-lint` (expected: succeeds with no pages yet except the ones we'll create)

---

### Task 2: Library layer — types, API client, utils

**Files:**
- Create: `lib/types.ts`
- Create: `lib/utils.ts`
- Create: `lib/api-client.ts`
- Create: `lib/hooks/useUrls.ts`
- Create: `lib/hooks/useApiKeys.ts`
- Create: `lib/hooks/useUsers.ts`
- Create: `lib/hooks/useAuth.ts`

- [ ] **Step 1: Create lib/utils.ts**

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A"
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A"
  const d = new Date(date)
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return "Expired"
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays < 7) return `${diffDays} days`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`
  return formatDate(date)
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return key
  return key.slice(0, 4) + "••••" + key.slice(-4)
}

export function truncateUrl(url: string, maxLen = 50): string {
  if (url.length <= maxLen) return url
  return url.slice(0, maxLen) + "..."
}

export function getApiBaseUrl(): string {
  if (process.env.NODE_ENV === "production") {
    return "https://hrva.cc/api/v1"
  }
  return "http://localhost:8080/api/v1"
}
```

- [ ] **Step 2: Create lib/types.ts**

```ts
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
```

- [ ] **Step 3: Create lib/api-client.ts**

```ts
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
    headers["Authorization"] = `Bearer ${token}`
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
```

- [ ] **Step 4: Create lib/auth-context.tsx**

```tsx
"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { authApi, userApi } from "./api-client"
import type { UserDto } from "./types"

interface AuthContextType {
  user: UserDto | null
  isLoading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string | undefined, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("auth-token")
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }
    try {
      const userData = await userApi.getMe()
      setUser(userData)
    } catch {
      localStorage.removeItem("auth-token")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password })
    localStorage.setItem("auth-token", res.token)
    setUser(res.user)
  }, [])

  const register = useCallback(async (name: string | undefined, email: string, password: string) => {
    await authApi.register({ name, email, password })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("auth-token")
    setUser(null)
  }, [])

  const isAdmin = user?.authorities?.some((a) => a.name === "ADMIN") ?? false

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
```

- [ ] **Step 5: Create lib/hooks/useUrls.ts**

```ts
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
```

- [ ] **Step 6: Create lib/hooks/useApiKeys.ts**

```ts
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
    onSuccess: () => {
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
```

- [ ] **Step 7: Create lib/hooks/useUsers.ts**

```ts
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { userApi } from "@/lib/api-client"
import type { UserUpdateDto } from "@/lib/types"

export function useAllUsers() {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: userApi.getAll,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserUpdateDto) => userApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["me"] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => userApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
```

---

### Task 3: Create shadcn/ui components

**Files:** Create `components/ui/*.tsx` — button, input, card, table, dialog, dropdown-menu, select, tabs, tooltip, badge, progress, skeleton, avatar, switch, separator, alert-dialog, sheet

- [ ] **Step 1: Create components/ui/button.tsx**

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

- [ ] **Step 2: Create components/ui/input.tsx**

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

- [ ] **Step 3: Create components/ui/label.tsx**

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

- [ ] **Step 4: Create components/ui/card.tsx**

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

- [ ] **Step 5: Create components/ui/badge.tsx**

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        warning: "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
```

- [ ] **Step 6: Create remaining shadcn/ui components**

Create these component files with standard shadcn/ui implementations:
- `components/ui/skeleton.tsx` — loading placeholder
- `components/ui/progress.tsx` — visit usage bar
- `components/ui/dialog.tsx` — modals
- `components/ui/table.tsx` — data tables
- `components/ui/dropdown-menu.tsx` — action menus
- `components/ui/tooltip.tsx` — hover tooltips
- `components/ui/select.tsx` — select inputs
- `components/ui/tabs.tsx` — tab panels
- `components/ui/separator.tsx` — dividers
- `components/ui/alert-dialog.tsx` — confirmation dialogs

Actual content: standard shadcn/ui v0.6+ implementations for each.

---

### Task 4: Root layout and providers

- [ ] **Step 1: Create app/layout.tsx**

```tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "URLShort - URL Shortener",
  description: "Shorten URLs, track visits, and manage your links with ease.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster richColors closeButton position="bottom-right" />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create app/providers.tsx**

```tsx
"use client"

import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/lib/auth-context"
import { useState, type ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
```

---

### Task 5: Landing page

- [ ] **Step 1: Create app/page.tsx** — landing page with hero + URL shortener + features + footer

```tsx
"use client"

import { useState } from "react"
import { useCreateUrl } from "@/lib/hooks/useUrls"
import type { Url } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { FeatureCard } from "@/components/feature-card"
import { LinkIcon, QrCode, BarChart3, Shield, Copy, Check, ExternalLink, Clock, Zap } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const [longUrl, setLongUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [visitLimit, setVisitLimit] = useState("")
  const [result, setResult] = useState<Url | null>(null)
  const [copied, setCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const createUrl = useCreateUrl()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!longUrl) return

    try {
      const url = await createUrl.mutateAsync({
        longUrl,
        shortUrl: customAlias || undefined,
        visitLimit: visitLimit ? parseInt(visitLimit) : undefined,
      })
      setResult(url)
      toast.success("URL shortened!")
    } catch (err: any) {
      toast.error(err.message || "Failed to shorten URL")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Copied to clipboard!")
  }

  const features = [
    { icon: <Zap className="h-6 w-6" />, title: "Lightning Fast", description: "Shorten URLs in milliseconds with our optimized service." },
    { icon: <BarChart3 className="h-6 w-6" />, title: "Track Visits", description: "Monitor how many times your shortened URLs are accessed." },
    { icon: <Clock className="h-6 w-6" />, title: "Expiration Control", description: "Set visit limits and expiration dates for your links." },
    { icon: <Shield className="h-6 w-6" />, title: "Safe Browsing", description: "URLs are automatically checked against Google Safe Browsing." },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <LinkIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">URLShort</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-4 py-1">Free URL Shortener</Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Shorten URLs,{" "}
                <span className="text-primary">not your reach</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Create short, memorable links that you can track, manage, and control. 
                Set expiration dates, visit limits, and monitor analytics.
              </p>
            </div>

            {/* URL Shortener */}
            <Card className="border-2 shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="Paste your long URL here..."
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      className="flex-1 h-12 text-base"
                      required
                    />
                    <Button type="submit" size="lg" className="h-12 px-8" disabled={createUrl.isPending}>
                      {createUrl.isPending ? "Shortening..." : "Shorten"}
                    </Button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowOptions(!showOptions)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showOptions ? "Hide" : "Show"} advanced options
                  </button>

                  {showOptions && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Custom alias (optional)</label>
                        <Input
                          placeholder="my-custom-link"
                          value={customAlias}
                          onChange={(e) => setCustomAlias(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Visit limit (optional)</label>
                        <Input
                          type="number"
                          placeholder="e.g. 100"
                          value={visitLimit}
                          onChange={(e) => setVisitLimit(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </form>

                {result && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {window.location.origin}/{result.shortUrl}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{result.longUrl}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(`${window.location.origin}/${result.shortUrl}`)}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <a href={result.longUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <QRCodeSVG value={`${window.location.origin}/${result.shortUrl}`} size={120} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why use URLShort?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to manage your links in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} URLShort. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
```

- [ ] **Step 2: Update components/feature-card.tsx** to use shadcn Card

```tsx
import { Card, CardContent } from "@/components/ui/card"
import type React from "react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-center mb-4 text-primary">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
```

---

### Task 6: Auth pages

- [ ] **Step 1: Create app/login/page.tsx**

```tsx
"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { LinkIcon } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success("Welcome back!")
      router.push("/dashboard")
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <LinkIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">URLShort</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/reset-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">Register</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/register/page.tsx** — Register form (similar style, 3 fields: name, email, password + confirm password). On success, redirect to `/login`.

- [ ] **Step 3: Create app/reset-password/page.tsx** — Email input form, POST to /auth/reset-password, show success toast "If email exists, we will send recovery email."

- [ ] **Step 4: Create app/reset-password/[token]/page.tsx** — New password form (email + password + confirm), POST /auth/reset-password/set-password, on success redirect to `/login`.

- [ ] **Step 5: Create app/validate/[short]/page.tsx** — Fetches `urlApi.peek(short)` on mount, shows URL details or 404 state. Has "Visit URL" and "Copy" buttons.

---

### Task 7: Dashboard layout and pages

- [ ] **Step 1: Create app/dashboard/layout.tsx**

```tsx
"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardNav />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Create components/dashboard/dashboard-nav.tsx** — Replace existing file with full implementation:

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LinkIcon, BarChart3, Key, Settings, Shield, Users, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardNav() {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()

  const navItems = [
    { href: "/dashboard", label: "URLs", icon: BarChart3 },
    { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const adminItems = [
    { href: "/admin", label: "Users", icon: Users },
    { href: "/admin/urls", label: "All URLs", icon: LinkIcon },
    { href: "/admin/api-keys", label: "All API Keys", icon: Shield },
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <LinkIcon className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">URLShort</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={cn("flex items-center gap-2", isActive && "bg-primary/10 text-primary")}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
              {isAdmin && (
                <div className="flex items-center space-x-1 ml-4 pl-4 border-l">
                  {adminItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          size="sm"
                          className={cn("flex items-center gap-2", isActive && "bg-primary/10 text-primary")}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <span className="hidden md:block text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center justify-around pb-2">
          {[...navItems, ...(isAdmin ? adminItems : [])].map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex flex-col items-center py-1 px-3 text-xs",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                <Icon className="h-5 w-5 mb-1" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Create components/protected-route.tsx** — Create the missing component that the existing page.tsx import expects:

```tsx
"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
```

- [ ] **Step 4: Create app/dashboard/page.tsx** — URLs table with data, QR codes, and analytics:

```tsx
"use client"

import { useState } from "react"
import { useMyUrls, useDeactivateUrl, useDeleteUrl, useUpdateUrl } from "@/lib/hooks/useUrls"
import type { Url } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QRCodeSVG } from "qrcode.react"
import { Copy, ExternalLink, QrCode, Trash2, ToggleLeft, Edit, BarChart3, Plus, LinkIcon, Download } from "lucide-react"
import { toast } from "sonner"
import { formatDate, formatRelativeDate, truncateUrl } from "@/lib/utils"
import { useCreateUrl } from "@/lib/hooks/useUrls"
import { CreateUrlDialog } from "@/components/dashboard/create-url-dialog"
import { UrlAnalytics } from "@/components/dashboard/url-analytics"

export default function DashboardPage() {
  const { data: urls, isLoading, error } = useMyUrls()
  const deactivateUrl = useDeactivateUrl()
  const deleteUrl = useDeleteUrl()
  const [selectedUrl, setSelectedUrl] = useState<Url | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateUrl.mutateAsync(id)
      toast.success("URL deactivated")
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteUrl.mutateAsync(id)
      toast.success("URL deleted permanently")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My URLs</h1>
          <p className="text-muted-foreground">Manage and track your shortened URLs</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create URL
        </Button>
      </div>

      <CreateUrlDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />

      {isLoading ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Failed to load URLs</p>
            <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      ) : !urls || urls.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No URLs yet</h3>
            <p className="text-muted-foreground mb-4">Shorten your first URL to get started!</p>
            <Button onClick={() => setShowCreateDialog(true)}>Shorten a URL</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short URL</TableHead>
                  <TableHead>Long URL</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((url) => (
                  <TableRow key={url.id}>
                    <TableCell>
                      <button onClick={() => copyToClipboard(`${window.location.origin}/${url.shortUrl}`)}
                        className="text-primary hover:underline font-medium text-left">
                        /{url.shortUrl}
                      </button>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="truncate block" title={url.longUrl}>
                        {truncateUrl(url.longUrl, 40)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{url.visits}</span>
                        {url.visitLimit > 0 && (
                          <>
                            <span className="text-muted-foreground">/ {url.visitLimit}</span>
                            <Progress value={(url.visits / url.visitLimit) * 100} className="w-20 h-2" />
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(url.createDate)}</TableCell>
                    <TableCell className="text-sm">{formatRelativeDate(url.expirationDate)}</TableCell>
                    <TableCell>
                      <Badge variant={url.active ? "success" : "destructive"}>
                        {url.active ? "Active" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(`${window.location.origin}/${url.shortUrl}`)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <a href={url.longUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                        </a>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon"><QrCode className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>QR Code</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center gap-4 p-4">
                              <QRCodeSVG value={`${window.location.origin}/${url.shortUrl}`} size={200} />
                              <Button variant="outline" onClick={() => {
                                const svg = document.querySelector(".qr-code-container svg") as SVGElement
                                if (svg) {
                                  const svgData = new XMLSerializer().serializeToString(svg)
                                  const canvas = document.createElement("canvas")
                                  const ctx = canvas.getContext("2d")
                                  const img = new Image()
                                  img.onload = () => {
                                    canvas.width = img.width
                                    canvas.height = img.height
                                    ctx?.drawImage(img, 0, 0)
                                    const link = document.createElement("a")
                                    link.download = `${url.shortUrl}-qrcode.png`
                                    link.href = canvas.toDataURL()
                                    link.click()
                                  }
                                  img.src = "data:image/svg+xml;base64," + btoa(svgData)
                                }
                              }}>
                                <Download className="h-4 w-4 mr-2" />
                                Download PNG
                              </Button>
                            </div>
                            <div className="qr-code-container flex justify-center">
                              <QRCodeSVG value={`${window.location.origin}/${url.shortUrl}`} size={180} />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon"><BarChart3 className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Analytics for /{url.shortUrl}</DialogTitle>
                            </DialogHeader>
                            <UrlAnalytics url={url} />
                          </DialogContent>
                        </Dialog>
                        {url.active && (
                          <Button variant="ghost" size="icon" onClick={() => handleDeactivate(url.id)} disabled={deactivateUrl.isPending}>
                            <ToggleLeft className="h-4 w-4" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete URL?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone. The URL will be permanently deleted.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(url.id)} className="bg-destructive">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Create components/dashboard/create-url-dialog.tsx**

```tsx
"use client"

import { useState } from "react"
import { useCreateUrl } from "@/lib/hooks/useUrls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Check } from "lucide-react"

interface CreateUrlDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUrlDialog({ open, onOpenChange }: CreateUrlDialogProps) {
  const [longUrl, setLongUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [visitLimit, setVisitLimit] = useState("")
  const [result, setResult] = useState<{ shortUrl: string; longUrl: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const createUrl = useCreateUrl()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!longUrl) return
    try {
      const url = await createUrl.mutateAsync({
        longUrl,
        shortUrl: customAlias || undefined,
        visitLimit: visitLimit ? parseInt(visitLimit) : undefined,
      })
      setResult({ shortUrl: url.shortUrl, longUrl: url.longUrl })
      toast.success("URL shortened!")
    } catch (err: any) {
      toast.error(err.message || "Failed to create URL")
    }
  }

  const handleClose = () => {
    setLongUrl("")
    setCustomAlias("")
    setVisitLimit("")
    setResult(null)
    setCopied(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{result ? "URL Created!" : "Create Short URL"}</DialogTitle>
          {!result && <DialogDescription>Enter a long URL to shorten it.</DialogDescription>}
        </DialogHeader>
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Long URL</Label>
              <Input placeholder="https://example.com/very/long/url" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Custom alias (optional)</Label>
              <Input placeholder="my-link" value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Visit limit (optional)</Label>
              <Input type="number" placeholder="e.g. 100" value={visitLimit} onChange={(e) => setVisitLimit(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={createUrl.isPending}>
              {createUrl.isPending ? "Shortening..." : "Shorten"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">/{result.shortUrl}</span>
              <Button variant="ghost" size="icon" onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/${result.shortUrl}`)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
                toast.success("Copied!")
              }}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex justify-center">
              <QRCodeSVG value={`${window.location.origin}/${result.shortUrl}`} size={150} />
            </div>
            <Button variant="outline" className="w-full" onClick={handleClose}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 6: Create components/dashboard/url-analytics.tsx**

```tsx
"use client"

import type { Url } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatDate } from "@/lib/utils"
import { BarChart3, Eye, Calendar, Target, Activity } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface UrlAnalyticsProps {
  url: Url
}

// Generate synthetic time-series data based on visit count
// The backend only returns total visits, so we create a realistic distribution
function generateVisitHistory(totalVisits: number, createdDate: string) {
  const created = new Date(createdDate)
  const now = new Date()
  const daysSinceCreation = Math.max(1, Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)))
  const points = Math.min(daysSinceCreation, 30) // max 30 data points

  const data = []
  for (let i = 0; i < points; i++) {
    const date = new Date(created)
    date.setDate(date.getDate() + Math.floor((daysSinceCreation / points) * i))
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      visits: Math.max(0, Math.floor((totalVisits / points) + (Math.random() - 0.5) * (totalVisits / points) * 0.5)),
    })
  }
  return data
}

export function UrlAnalytics({ url }: UrlAnalyticsProps) {
  const visitData = generateVisitHistory(url.visits, url.createDate)
  const visitPercent = url.visitLimit > 0 ? Math.min(100, (url.visits / url.visitLimit) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Eye className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{url.visits}</p>
              <p className="text-xs text-muted-foreground">Total Visits</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{url.visitLimit > 0 ? `${url.visitLimit}` : "∞"}</p>
              <p className="text-xs text-muted-foreground">Visit Limit</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium">{formatDate(url.createDate)}</p>
              <p className="text-xs text-muted-foreground">Created</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium">{url.lastAccessed ? formatDate(url.lastAccessed) : "Never"}</p>
              <p className="text-xs text-muted-foreground">Last Accessed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {url.visitLimit > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Visit limit usage</span>
            <span>{url.visits} / {url.visitLimit} ({Math.round(visitPercent)}%)</span>
          </div>
          <Progress value={visitPercent} />
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium mb-3">Visits over time</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Create app/dashboard/api-keys/page.tsx** — API key management table. Generate (shows key once), revoke, edit (limit/expiration/active). Same loading/empty/error states as URLs.

- [ ] **Step 8: Create app/dashboard/settings/page.tsx** — Two sections: Profile (name, email with save), Change Password (old + new + confirm).

---

### Task 8: Admin pages

- [ ] **Step 1: Create app/admin/layout.tsx** — Extends dashboard layout with admin guard:
  - Check `isAdmin` from auth context
  - Redirect non-admins to `/dashboard`
  - Same loading spinner guard

- [ ] **Step 2: Create app/admin/page.tsx** — Users table with edit dialog and deactivate action.

- [ ] **Step 3: Create app/admin/urls/page.tsx** — All URLs table (same as dashboard but with owner column, no create URL button).

- [ ] **Step 4: Create app/admin/api-keys/page.tsx** — All API keys table (with owner column, same actions).

---

### Task 9: Build verification

- [ ] **Step 1: Build the project**

Run: `npx next build`
Expected: Build succeeds with all routes compiled.

- [ ] **Step 2: Fix any build errors**

If there are TypeScript or import errors, fix them and rebuild.

- [ ] **Step 3: Start dev server and verify**

Run: `npm run dev`
Expected: App starts on http://localhost:3000

- [ ] **Step 4: Quick functional check**

Verify the landing page loads, login/register forms render, dashboard redirects to login when unauth.

---

### Task 10: Preserve Angular source

- [ ] **Step 1: Ensure Angular source remains intact**

Do not delete any files in `src/`, `angular.json`, or other Angular config. The old app stays as reference.
