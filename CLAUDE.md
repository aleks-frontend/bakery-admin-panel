# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # tsc && vite build
npm run lint      # ESLint with --max-warnings 0 (zero warnings allowed)
npm run preview   # Preview production build
```

No test runner is configured.

## Environment

Copy `.env.example` to `.env` and fill in all five variables:

```
VITE_API_BASE_URL=        # GET    /webhook/bread-orders
VITE_BREAD_TYPES_URL=     # GET    /webhook/bread-types
VITE_UPDATE_STATUS_URL=   # PATCH  /webhook/bakery/orders/status
VITE_ADMIN_ORDER_URL=     # POST   /webhook/admin/bakery-order
VITE_DELETE_ORDER_URL=    # DELETE /webhook/bakery/orders
```

All webhooks are n8n workflows. See `n8n/README.md` for details.

## Architecture

Single-page React 18 + TypeScript app. There is only one route — `OrdersPage` — rendered directly in `App.tsx`. No router library is used.

**Data flow:**
```
n8n webhook (GET) → fetchOrdersQueryFn() → Zod validation (APIOrderSchema)
  → mapApiOrderToOrder() → React Query cache → components via useOrdersQuery()
```

The API returns snake_case with unusual keys like `"Order ID"` and `"Ordered articles"`. `src/lib/orderMapper.ts` normalises these to camelCase. `src/lib/orderParser.ts` parses the raw articles string (`"• Item × qty = price RSD\n..."`) into `ParsedOrderItem[]` using a regex.

**Layer overview:**

| Layer | Path | Responsibility |
|-------|------|---------------|
| Types & schemas | `src/types/order.ts` | Zod schemas for both API shape and frontend model |
| API + mapping | `src/lib/api.ts`, `orderMapper.ts`, `orderParser.ts` | Fetch, validate, transform |
| Hooks | `src/hooks/` | React Query wrappers consumed by components |
| Page | `src/app/OrdersPage.tsx` | Search, status filter, selection state, export triggers |
| Components | `src/components/` | Table, modals, PDF renderers, shadcn/ui primitives in `ui/` |
| i18n | `src/i18n/` | i18next init + `en.json`, `sr.json`, `hu.json` |
| n8n workflows | `n8n/` | Backend webhook definitions — import into n8n to run the system |

## Key conventions

- **Imports:** use `@/` alias for `src/` (e.g. `@/components/ui/button`).
- **Styling:** Tailwind utility classes + CSS variables (HSL) in `src/index.css`. Use `cn()` from `@/lib/utils` to merge classes.
- **shadcn/ui:** Radix-based primitives live in `src/components/ui/`. Do not edit them directly; add variants instead.
- **State:** No global state library. Server state via React Query (30 s staleTime). Component-local state for UI (search text, filter, row selection).
- **i18n:** All user-visible strings go through `useTranslation()` / `t()`. Add keys to all three locale files (`en`, `sr`, `hu`) when adding UI copy.
- **TypeScript:** Strict mode with `noUnusedLocals` and `noUnusedParameters` — the build will fail on unused symbols.

## Known incomplete features

- No pagination (planned for large order lists).
- No date-range filter (planned).
