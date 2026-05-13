# Migrate URL Shortener Frontend to Next.js

**Date:** 2026-05-13
**Status:** Draft

## Overview

Complete the partial migration of the URL Shortener frontend from Angular 14 to Next.js 14 App Router. The existing Angular app (`src/app/`) is fully functional but uses outdated tooling. Partial Next.js migration artifacts already exist (components, tailwind config, next-env) but are incomplete. This spec covers building a complete, production-ready Next.js application that correctly implements all 20+ backend API endpoints.

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | Modern React meta-framework, already partially set up |
| Language | TypeScript (strict) | Existing standard |
| Styling | Tailwind CSS + shadcn/ui | Already configured; shadcn provides accessible, composable components |
| Server State | TanStack React Query | Caching, refetching, loading/error states out of the box |
| Forms | React Hook Form + Zod | Performant uncontrolled forms, schema validation |
| Charts | Recharts | Composable React charts for URL analytics |
| QR Codes | qrcode.react | Simple inline QR rendering with download support |
| Themes | next-themes | Persistent dark/light mode |
| Icons | Lucide React | Already imported, clean consistent icon set |
| Toasts | sonner | shadcn-recommended toast library |

## Route Architecture

```
/                         → Landing page (hero + URL shortener)
/login                    → Login
/register                 → Register
/reset-password           → Request password reset
/reset-password/[token]   → Set new password
/validate/[short]         → Peek URL details
/dashboard                → Dashboard layout (protected)
/dashboard/               → My URLs table + analytics + QR codes
/dashboard/api-keys       → API key management
/dashboard/settings       → Profile + change password
/admin                    → Admin layout (admin-guarded)
/admin/                   → Users management table
/admin/urls               → All URLs table
/admin/api-keys           → All API keys table
```

## API Endpoints (all under `http://localhost:8080/api/v1/`)

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/login | Login, returns JWT + UserDto |
| POST | /auth/register | Register user |
| POST | /auth/reset-password | Request password reset email |
| POST | /auth/reset-password/set-password | Set new password with token |

### URL
| Method | Path | Description |
|--------|------|-------------|
| POST | /url/new | Create short URL (unauthenticated) |
| POST | /url/new/{apiKey} | Create short URL with API key |
| GET | /url/my | Get current user's URLs |
| GET | /url/my/{apiKey} | Get URLs via API key |
| GET | /url/all | Get all URLs (admin) |
| GET | /url/redirect/{short} | Get URL info by short code |
| GET | /url/peek/{short} | Peek URL (public info, no redirect) |
| PUT | /url | Update URL (visit limit, expiration) |
| GET | /url/deactivate/{id} | Revoke/deactivate URL |
| GET | /url/delete/{id} | Permanently delete URL |

### API Key
| Method | Path | Description |
|--------|------|-------------|
| GET | /api-key/new | Generate new API key |
| GET | /api-key/my | Get current user's API keys |
| GET | /api-key | Get all API keys (admin) |
| GET | /api-key/revoke/{id} | Revoke API key |
| PUT | /api-key | Update API key (limit, expiration, active) |

### User
| Method | Path | Description |
|--------|------|-------------|
| GET | /user/me | Get current user |
| PUT | /user | Update user (admin) |
| PUT | /user/update-password | Change password |
| GET | /user/all | Get all users (admin) |
| DELETE | /user/{id} | Delete/deactivate user (admin) |

### Redirect
| Method | Path | Description |
|--------|------|-------------|
| GET | /{short} | Redirect to long URL |
| GET | / | Root redirect to frontend |

## Data Models

### User
```
{ id, name, email, password?, apiKeySlots, authorities[], createDate, lastLogin, active }
```

### Url
```
{ id, longUrl, shortUrl, owner, apiKey, createDate, lastAccessed, expirationDate, visits, visitLimit, lastSafeBrowsingCheck?, active, platformType?, threatType? }
```

### ApiKey
```
{ id, key, owner, apiCallsLimit, apiCallsUsed, createDate, expirationDate, active }
```

### PeekUrl
```
{ longUrl, shortUrl, createDate }
```

## Auth Flow
1. User logs in → `POST /auth/login` → receives `{ token, user }`
2. Token stored in `localStorage('auth-token')`
3. All subsequent API calls include `Authorization: Bearer <token>` header
4. On app load: if token exists in localStorage, call `GET /user/me` to validate and populate user context
5. Logout: clear localStorage, reset context, redirect to `/`
6. Auth context (`lib/auth-context.tsx`) provides `user`, `login`, `register`, `logout`, `isLoading`, `isAdmin` app-wide

## Component Architecture

### Layout Hierarchy
```
app/layout.tsx                    → ThemeProvider, Toaster, AuthProvider
  app/page.tsx                    → Landing page
  app/login/page.tsx              → Login form
  app/register/page.tsx           → Register form
  app/reset-password/page.tsx     → Request reset
  app/reset-password/[token]/page.tsx → Set password
  app/validate/[short]/page.tsx   → Peek URL
  app/dashboard/layout.tsx        → ProtectedRoute, Sidebar, TopBar
    app/dashboard/page.tsx        → URLs table + analytics
    app/dashboard/api-keys/page.tsx → API keys management
    app/dashboard/settings/page.tsx → Profile + change password
  app/admin/layout.tsx            → ProtectedRoute + admin guard
    app/admin/page.tsx            → Users management
    app/admin/urls/page.tsx       → All URLs
    app/admin/api-keys/page.tsx   → All API keys
```

### Key Components
- `components/ui/*` — shadcn/ui primitives
- `components/landing/hero.tsx` — Landing page hero + URL shortener input
- `components/landing/features.tsx` — Feature cards grid
- `components/landing/url-result.tsx` — Shortened URL result with copy + QR
- `components/auth/login-form.tsx` — Login form (RHF + Zod)
- `components/auth/register-form.tsx` — Register form
- `components/auth/reset-password-form.tsx` — Reset request form
- `components/auth/set-password-form.tsx` — New password form
- `components/dashboard/dashboard-nav.tsx` — Sidebar nav (replace existing)
- `components/dashboard/urls-table.tsx` — URLs data table (replace import)
- `components/dashboard/url-qr-dialog.tsx` — QR code modal
- `components/dashboard/url-analytics.tsx` — Visits chart
- `components/dashboard/api-keys-table.tsx` — API keys data table
- `components/dashboard/settings-form.tsx` — Profile + password forms
- `components/dashboard/create-url-dialog.tsx` — Create URL modal for dashboard
- `components/admin/users-table.tsx` — Users data table
- `components/admin/all-urls-table.tsx` — All URLs table
- `components/admin/all-api-keys-table.tsx` — All API keys table
- `components/protected-route.tsx` — Auth guard wrapper
- `components/admin-route.tsx` — Admin role guard wrapper

### Data Fetching Hooks (`lib/hooks/`)
- `useUrls.ts` — `useQuery` for URL lists, `useMutation` for CRUD
- `useApiKeys.ts` — `useQuery` for API keys, `useMutation` for CRUD
- `useUsers.ts` — `useQuery` for users (admin)
- `useAuth.ts` — Re-exports from AuthContext

## UI/UX States Per Component

Every data-fetching component handles four states:
1. **Loading:** Skeleton placeholders matching layout shape
2. **Empty:** Illustration + message + CTA (e.g., "No URLs yet — shorten your first one")
3. **Error:** Error message + retry button (toast for non-critical, inline for data areas)
4. **Success:** Rendered data with appropriate actions

## Extras

### Dark Mode
- Persistent theme via `next-themes` (system-prefers by default, user can override)
- Toggle in dashboard top bar and landing page
- Tailwind dark mode via CSS variables (already configured)
- All components tested in both modes

### QR Code Generation
- QR code generated for every shortened URL using `qrcode.react`
- Displayed inline after URL creation on landing page
- Accessible via action button in dashboard URLs table
- Downloadable QR in dialog (PNG format)

### URL Analytics
- Visit progress bar (% of visit limit used)
- Simple line chart showing visits over time (using Recharts)
- Shown in a detail drawer/modal when clicking a URL row

### Landing Page Redesign
- Gradient hero with animated illustration
- Prominent URL shortener input in hero
- Feature cards below
- Clean, modern footer
- Responsive at all breakpoints

## File Structure (new files only)

```
app/
  globals.css               → Tailwind + CSS variables
  layout.tsx                → Root layout
  page.tsx                  → Landing page
  login/page.tsx
  register/page.tsx
  reset-password/page.tsx
  reset-password/[token]/page.tsx
  validate/[short]/page.tsx
  dashboard/
    layout.tsx
    page.tsx
    api-keys/page.tsx
    settings/page.tsx
  admin/
    layout.tsx
    page.tsx
    urls/page.tsx
    api-keys/page.tsx
components/
  ui/                       → shadcn/ui components
  landing/
    hero.tsx
    features.tsx
    url-result.tsx
  auth/
    login-form.tsx
    register-form.tsx
    reset-password-form.tsx
    set-password-form.tsx
  dashboard/
    dashboard-nav.tsx       → Replace existing
    urls-table.tsx          → Replace missing import
    url-qr-dialog.tsx
    url-analytics.tsx
    api-keys-table.tsx
    settings-form.tsx
    create-url-dialog.tsx
  admin/
    users-table.tsx
    all-urls-table.tsx
    all-api-keys-table.tsx
  protected-route.tsx       → Replace missing import
  admin-route.tsx
lib/
  api-client.ts
  auth-context.tsx          → Replace missing import
  types.ts
  hooks/
    useUrls.ts
    useApiKeys.ts
    useUsers.ts
  utils.ts
next.config.mjs
package.json
postcss.config.js           → Already exists
tailwind.config.js          → Already exists
tsconfig.json
```

## Out of Scope (for this project)
- SSO logins (GitHub, Google)
- 2FA
- URL categorization
- Bulk URL shortening
- Backend changes

## API Path Corrections from Angular App
The old Angular `data.service.ts` had incorrect paths for API key endpoints. The correct paths (confirmed via OpenAPI spec on localhost:8080) are:
- `/api-key/new` (was `/key/new`)
- `/api-key/my` (was `/key/my`)
- `/api-key` (was `/key`)
- `/api-key/revoke/{id}` (was `/key/revoke/{id}`)
- `/user/{id}` (was `/user{id}` — missing slash)
