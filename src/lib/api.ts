import { APIOrderSchema, Order } from "@/types/order"
import { mapApiOrderToOrder } from "./orderMapper"
import { QueryClient } from "@tanstack/react-query"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://n8n.aleksthecoder.com/webhook/bread-orders"

/**
 * Query function for fetching orders from the n8n webhook
 * Validates response using Zod and maps to frontend model
 * Used with TanStack Query's fetchQuery
 */
export async function fetchOrdersQueryFn(): Promise<Order[]> {
  const response = await fetch(API_BASE_URL)
  
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
 * Updates order status
 * TODO: Implement n8n webhook call for status updates
 * This will be called when status update functionality is enabled
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: Order["status"]
): Promise<void> {
  // TODO: Implement n8n webhook POST request to update order status
  // Example: POST https://n8n.aleksthecoder.com/webhook/update-order-status
  // Body: { orderId, status: newStatus }
  
  throw new Error("Status update not yet implemented")
}
