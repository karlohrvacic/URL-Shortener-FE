# hrva.cc — URL Shortener Frontend

Next.js 16 App Router + React 19, deployed on Cloudflare Workers via `@opennextjs/cloudflare`. Deployed at [hrva.cc](https://hrva.cc).

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js dev server (TurboPack) |
| `npm run build` | Standard Next.js build |
| `npm run build:cf` | Cloudflare Worker build |
| `npm run preview` | Build + Cloudflare local preview |
| `npm run deploy` | Build + Cloudflare deploy |
| `npm run cf-typegen` | Regenerate `cloudflare-env.d.ts` from wrangler config |
| `npm run lint` | ESLint via `next lint` |

No test framework is set up.

---

## API Docs (Swagger)

| Environment | Swagger UI | OpenAPI JSON |
|-------------|------------|--------------|
| Production  | `https://hrva.cc/swagger-ui/index.html` | `https://hrva.cc/v3/api-docs` |
| Local dev   | `http://localhost:8080/swagger-ui/index.html` | `http://localhost:8080/v3/api-docs` |

---

## Architecture

### Routing (`app/`)
- `/` — Landing page (public URL shorten + logged-in experience)
- `/login`, `/register`, `/reset-password/[token]` — Auth flows
- `/validate/[short]` — Peek at a URL before visiting
- `/dashboard/*` — Protected; user's URLs, API keys, settings
- `/admin/*` — Protected + ADMIN role; user management, URL admin, API key admin

`@/*` path alias maps to **project root** (e.g. `@/lib/api-client` → `lib/api-client.ts`).

### Key directories
```
app/          — Next.js App Router pages
components/   — React components
  ui/         — shadcn/ui primitives (button, card, dialog, table, etc.)
  dashboard/  — Dashboard-specific (create-url-dialog, url-analytics, dashboard-nav)
lib/          — Shared logic
  api-client.ts   — Fetch-based API client
  auth-context.tsx — Auth state (React context)
  types.ts        — All TypeScript interfaces
  hooks/          — TanStack React Query hooks (useUrls, useApiKeys, useUsers)
  utils.ts        — cn(), formatDate(), getApiBaseUrl(), etc.
```

### API Client (`lib/api-client.ts`)
- Custom `request<T>(method, path, body?)` wrapping `fetch`
- Reads `localStorage.getItem("auth-token")` — sends raw token as `Authorization` header (no "Bearer " prefix)
- `ApiError` class exposes `.status` and `.message`
- API base URL switches by env:
  - **Dev**: `http://localhost:8080/api/v1`
  - **Prod**: `https://hrva.cc/api/v1`
- All endpoints are under `/api/v1/...` server-side (hardcoded in `utils.ts`)

### Auth (`lib/auth-context.tsx`)
- React Context provider wrapping the tree under `Providers`
- On mount: reads `auth-token` from localStorage, calls `GET /user/me` to hydrate user
- `login()` stores token and sets user; `logout()` removes token and clears user
- `isAdmin` derived from `user.authorities` containing `{ name: "ADMIN" }`
- **No route protection middleware** — dashboard/admin layouts redirect client-side via `useEffect`

### Data Fetching (TanStack React Query 5)
- Query client in `providers.tsx`: `staleTime: 30s`, `retry: 1`
- Hooks in `lib/hooks/` follow pattern: `useXxx()` for queries, `useXxx()` for mutations
- Mutations invalidate relevant query keys (`["urls"]`, `["apiKeys"]`, `["users"]`, `["me"]`)

### Styling
- Tailwind CSS with custom amber/brown CSS variable theme (`--primary: 38 92% 50%`)
- **Dark by default** with `.light` class override via `next-themes`
- Custom utility classes: `.glass`, `.glass-strong`, `.glow-amber`, `.text-gradient-amber`, `.divider-amber`, `.noise-bg`
- Animation utilities: `.animate-fade-up`, `.animate-fade-in`, `.animate-scale-in`, `.delay-{100,200,300,400,500}`
- Fonts: DM Serif Display (display) + Plus Jakarta Sans (body) via `next/font`

### UI Components
- shadcn/ui style: compose Radix primitives + `class-variance-authority` + `tailwind-merge` (via `cn()`)
- `sonner` for toasts, `lucide-react` for icons, `qrcode.react` for QR codes
- `recharts` for analytics charts (used in `url-analytics.tsx`)

### Deployment (Cloudflare Workers)
- Built with `@opennextjs/cloudflare` — config at `open-next.config.ts` (minimal, uses defaults)
- `wrangler.jsonc`: name `url-shortener`, `nodejs_compat` flag, assets from `.open-next/assets`

---

## API Migration (localhost vs prod)

The local backend (`localhost:8080`) has an updated API that differs significantly from what the current frontend (`hrva.cc` prod) uses. The frontend **needs to be updated** to match the new API layout below:

### URL Endpoints

| Old | New | Notes |
|-----|-----|-------|
| `POST /api/v1/url/new` | `POST /api/v1/urls` | Same body |
| `POST /api/v1/url/new/{apiKey}` | `POST /api/v1/urls` (with `X-Api-Key` header) | API key moved from path to header |
| `GET /api/v1/url/redirect/{short}` | `GET /api/v1/urls/{short}` | |
| `GET /api/v1/url/peek/{short}` | `GET /api/v1/urls/{short}/peek` | Moved to /peek (old /preview now returns link preview) |
| `PUT /api/v1/url` | `PUT /api/v1/urls/{id}` | `id` moved from body to path |
| `GET /api/v1/url/my` | `GET /api/v1/urls` | Now paginated (`?page=0&size=20`) |
| `GET /api/v1/url/my/{apiKey}` | `GET /api/v1/urls` (with `X-Api-Key` header) | API key in header |
| `GET /api/v1/url/all` | `GET /api/v1/urls/all` | Now paginated |
| `GET /api/v1/url/deactivate/{id}` | `PATCH /api/v1/urls/{id}/deactivate` | **GET → PATCH** |
| `GET /api/v1/url/delete/{id}` | `DELETE /api/v1/urls/{id}` | **GET → DELETE** |

### API Key Endpoints

| Old | New | Notes |
|-----|-----|-------|
| `GET /api/v1/key/new` | `POST /api/v1/api-keys` | **GET → POST** |
| `GET /api/v1/key/my` | `GET /api/v1/api-keys` | |
| `GET /api/v1/key` | `GET /api/v1/api-keys/all` | Now paginated |
| `PUT /api/v1/key` | `PUT /api/v1/api-keys/{id}` | `id` moved from body to path |
| `GET /api/v1/key/revoke/{id}` | `PATCH /api/v1/api-keys/{id}/revoke` | **GET → PATCH** |

### User Endpoints

| Old | New | Notes |
|-----|-----|-------|
| `GET /api/v1/user/all` | `GET /api/v1/users` | Now paginated |
| `PUT /api/v1/user` | `PUT /api/v1/users/{id}` | `id` moved from body to path |
| `PUT /api/v1/user/update-password` | `PATCH /api/v1/users/password` | |
| `DELETE /api/v1/user/{id}` | `DELETE /api/v1/users/{id}` | Unchanged |
| `GET /api/v1/user/me` | `GET /api/v1/users/me` | Unchanged |

### Auth Endpoints

| Old | New | Notes |
|-----|-----|-------|
| `POST /api/v1/auth/register` | Unchanged | `name` removed from body |
| `POST /api/v1/auth/login` | Unchanged | |
| `POST /api/v1/auth/reset-password` | `POST /api/v1/auth/password-reset` | |
| `POST /api/v1/auth/reset-password/set-password` | `POST /api/v1/auth/password-reset/confirm` | |

### Response Shape Changes

- **List endpoints now paginated**: `GET /urls`, `/urls/all`, `/api-keys/all`, `/users` return `Page<T>` with `content`, `totalElements`, `totalPages`, `number`, `size`. Add `?page=0&size=20` query params.
- **`UrlResponse`** replaces raw `Url` entity — fields removed: `owner`, `apiKey`, `lastAccessed`, `lastSafeBrowsingCheck`, `platformType`, `threatEntryType`, `threatType`. New field: `ownerEmail` (populated for owned URLs, null for anonymous).
- **`ApiKeyResponse`** replaces raw `ApiKey` entity — fields removed: `owner`, `urls`
- **Error format**: now `{ "error": "message" }` instead of old `ApiException` wrapper
- **CORS**: now allows all standard methods (`GET, POST, PUT, PATCH, DELETE, OPTIONS`) instead of only `GET, POST`

### New Endpoints (backend only, not yet in prod)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/v1/urls/{short}/qr?size=300` | GET | Returns QR code as `image/png` bytes. Default 300×300. Use directly in `<img>` src via `urlApi.getQrCodeUrl(short)`. |
| `GET /api/v1/urls/{short}/preview` | GET | Link preview: scrapes destination URL for OG/Twitter meta tags. Returns `LinkPreviewResponse { url, title?, description?, imageUrl? }`. Gracefully degrades (null fields) on timeout/error. |
| `POST /api/v1/urls/bulk` | POST | Bulk create URLs. Body: `[ CreateUrlDto, ... ]`. Response: `[ UrlResponse, ... ]`. Requires auth (`ROLE_USER`). |

---

## Gotchas

- **No `.env` files** — API base URL is hardcoded in `lib/utils.ts` and switches on `NODE_ENV`
- **Auth token stored without "Bearer" prefix** — the backend expects the raw token string in the `Authorization` header
- **No middleware-based route protection** — dashboard/admin check auth in a client `useEffect`, creating a flash of unauthenticated content
- **`@/*` maps to root** — unlike the common Next.js pattern of mapping to `src/*`
- **pnpm/npm**: lockfile is `package-lock.json` (npm), not pnpm 
