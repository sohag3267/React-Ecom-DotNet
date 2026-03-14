# DebuggerMind - AI Coding Agent Instructions

## Project Overview

Next.js 15 App Router e-commerce application with multi-language support (Bengali primary), shadcn/ui components, and external API integration. Migrated from React/Vite.

## Architecture Patterns

### API Service Layer (Fluent Builder Pattern)

All API calls use `ApiClient` class from `app/lib/api-client.ts`:

```typescript
const response = await new ApiClient(apiRoutes.products)
  .withMethod("GET")
  .withParams({ per_page: 12 })
  .withCookieHeaders(cookies()) // For authenticated requests
  .execute<ProductsResponse>();
```

- Server actions in `action.ts` files fetch data
- Routes defined in `app/lib/api-route.ts`
- Base URL from `API_BASE_URL` env var

### File Organization Convention

**Route-specific logic uses this triplet pattern:**

- `action.ts` - Server actions (data fetching/mutations)
- `model.ts` - TypeScript types/interfaces
- `page.tsx` - React Server Component

Example: `app/(app-routes)/products/{action.ts, model.ts, page.tsx}`

### Server/Client Component Split (SEO-Optimized)

**Critical for SEO**: Main pages are Server Components, interactivity split to Client Components:

- `page.tsx` - Server Component (SEO-friendly, data fetching, initial render)
- Small client components for filters/interactions (`ProductFilters.tsx`, `ProductToolbar.tsx`)
- Reusable components across pages (`ProductCardItem.tsx`, `ProductsGrid.tsx`)
- **Avoid**: Large `*PageClient.tsx` wrappers that render everything client-side

### State Management Strategy

- **Jotai atoms** for client state (see `app/store/mini-profile.atom.ts`)
- **React Context** for cart (`app/contexts/CartContext.tsx`)
- **Server actions** for data fetching (no client-side React Query)
- Use `atomWithStorage` for persistence across navigation

### Authentication Flow

1. JWT tokens stored in cookies (`__token__` defined in `app/lib/config/auth.config.ts`)
2. Middleware (`middleware.ts`) protects routes: `/profile`, `/checkout`, `/admin`
3. Auth redirects handled by middleware, not client-side
4. `AuthInitializer` component in root layout fetches user profile on mount
5. User state stored in `miniProfileAtom` (Jotai)

### Multi-language (i18n)

- **Primary language: Bengali (bn)**, secondary: English
- Uses react-i18next with 6 languages (en, es, fr, bn, hi, ar)
- Translation files: `app/i18n/locales/*.json`
- All metadata includes Bengali (`DebuggerMind - প্রিমিয়াম ই-কমার্স`)
- RTL support via `RTLProvider` for Arabic

### Navigation Behavior

- **Special Navigation Links** (Featured, Today's Deals, Top Selling):
  - On homepage: Smooth scroll to corresponding sections
  - On other pages: Navigate to `/products` page with appropriate filter query parameters
  - Middleware adds `x-pathname` header for server components to detect current page
- Homepage sections use `id` attributes: `featured-products`, `today-deals`, `top-selling`
- `NavigationClient` handles click behavior based on current path

### Provider Hierarchy (Critical Order)

In `app/layout.tsx` → `GlobalProvider`:

```
JotaiProvider → ThemeProvider → I18nProvider → RTLProvider
  → CartProvider → TooltipProvider → AuthInitializer
```

Don't reorder - breaks auth initialization and theming.

## Path Aliases & Imports

- `@/` maps to `app/*` (tsconfig.json baseUrl)
- Example: `@/lib/api-client.ts`, `@/components/shared/ui/button`
- UI components from shadcn: `@/components/shared/ui/*`

## Development Commands

```bash
npm run dev      # Start dev server (Next.js 15)
npm run build    # Production build
npm run lint     # ESLint check
```

## Key Files to Reference

- **API Client**: `app/lib/api-client.ts` - Fluent interface for all HTTP calls
- **Auth Middleware**: `middleware.ts` - Route protection logic
- **Global Providers**: `app/components/shared/providers/global-provider.tsx`
- **Cart Logic**: `app/contexts/CartContext.tsx` - Reducer pattern with localStorage
- **Product Actions**: `app/(app-routes)/products/action.ts` - Server-side data fetching
- **Categories Cache**: `app/components/shared/actions/categories.ts` - Cached category data (1hr TTL)

## Data Caching Strategy

### Server-Side Caching (SEO-Friendly)

- **Categories**: Cached for 1 hour using `unstable_cache` in server actions
- Avoids redundant API calls across the app
- Still server-rendered for SEO (search engines see categories)
- Can be revalidated on-demand with `revalidateCategories()`

Example:

```typescript
// Categories are fetched once and cached
const response = await getAllCategories();
// Reused across: Navigation, Filters, Product Pages
```

### When NOT to Use Client State for SEO-Critical Data

- ❌ Categories (needed in navigation - must be server-rendered)
- ❌ Product listings (must be crawlable by search engines)
- ✅ Cart items (user-specific, doesn't need SEO)
- ✅ UI preferences (dark mode, language - doesn't need SEO)

## Common Patterns

### Component Reusability

Product display components are designed to be reused:

- `ProductCardItem.tsx` - Client component with hover effects, wishlist, cart actions
- `ProductsGrid.tsx` - Responsive grid layout wrapper
- `ProductFilters.tsx` - Category/brand/special offer filters (client-side URL updates)
- `ProductToolbar.tsx` - Search, sort, view mode controls
- `ProductPagination.tsx` - Server-side pagination controls

Use these in any page that displays products (home, search, category pages).

### Adding New Protected Routes

1. Add route to `protectedRoutes` array in `middleware.ts`
2. Create server action in route's `action.ts`
3. Use `.withCookieHeaders(cookies())` in ApiClient for auth

### Creating New API Endpoints

1. Add route constant to `app/lib/api-route.ts`
2. Create server action using ApiClient fluent interface
3. Define response model in route's `model.ts`

### Working with Forms

- Use react-hook-form (installed)
- Zod for validation (v4.1.11)
- Server actions handle mutations, return `ApiResponse<T>`

## Environment Variables

- `API_BASE_URL` - Backend API base URL (required)
- `NEXT_PUBLIC_SITE_URL` - Site URL for metadata/SEO

## Notes

- All images use Next.js `<Image>` with wildcard remote patterns
- Cart calculates: subtotal, 10% tax, ৳100 shipping (free over ৳1000)
- Uses sonner for toast notifications
- Dark/light mode via next-themes
