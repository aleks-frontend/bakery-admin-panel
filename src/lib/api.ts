import {
  APIOrderSchema,
  Order,
  OrderStatus,
  OrderStatusWebhookRequestSchema,
  OrderStatusWebhookResponseSchema,
} from "@/types/order"
import { mapApiOrderToOrder } from "./orderMapper"
import { QueryClient } from "@tanstack/react-query"

/** Origin only. Set `VITE_API_BASE_URL` in `.env` (e.g. `https://your-host.com/`); a path on the value is ignored via `origin`. */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim()
  if (!raw) {
    throw new Error(
      "Missing VITE_API_BASE_URL. Add it to your .env file (see .env.example).",
    )
  }
  return new URL(raw).origin
}

const ORDERS_LIST_WEBHOOK_PATH = "webhook/bread-orders"

export function getOrdersListUrl(): string {
  return `${getApiBaseUrl()}/${ORDERS_LIST_WEBHOOK_PATH}`
}

/**
 * Query function for fetching orders from the n8n webhook
 * Validates response using Zod and maps to frontend model
 * Used with TanStack Query's fetchQuery
 */
export async function fetchOrdersQueryFn(): Promise<Order[]> {
  const response = await fetch(getOrdersListUrl())
  
  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  
  // Validate response is an array
  if (!Array.isArray(data)) {
    throw new Error("Invalid API response: expected an array")
  }

  // Validate each order using Zod schema
  const validatedOrders = data.map((item, index) => {
    try {
      return APIOrderSchema.parse(item)
    } catch (error) {
      throw new Error(`Invalid order at index ${index}: ${error}`)
    }
  })

  // Map to frontend model
  return validatedOrders.map(mapApiOrderToOrder)
}

/**
 * Fetches orders using TanStack Query's fetchQuery
 * Provides better caching and integration with React Query
 */
export async function fetchOrders(queryClient: QueryClient): Promise<Order[]> {
  return queryClient.fetchQuery({
    queryKey: ["orders"],
    queryFn: fetchOrdersQueryFn,
    staleTime: 30000, // Consider data fresh for 30 seconds
  })
}

/**
 * PATCH order status changes to the n8n webhook.
 * Payload shape: `[{ updates: [{ orderId, status }, ...] }]`
 */
export async function patchOrdersStatusUpdate(
  updates: { orderId: string; status: OrderStatus }[],
  requestUrl: string,
): Promise<{ success: boolean; updatedCount: number }> {
  if (!updates.length) {
    throw new Error("patchOrdersStatusUpdate: at least one update is required")
  }

  const body = OrderStatusWebhookRequestSchema.parse({ updates })

  const response = await fetch(requestUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to update order status: ${response.status} ${response.statusText}`,
    )
  }

  const data = await response.json()
  return OrderStatusWebhookResponseSchema.parse(data)
}
