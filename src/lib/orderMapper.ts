import { APIOrder, Order, OrderStatus, OrderStatusSchema } from "@/types/order"
import { parseOrderedArticles } from "./orderParser"

function normalizeApiOrderStatus(raw: string): OrderStatus {
  const s = raw.trim()
  const direct = OrderStatusSchema.safeParse(s)
  if (direct.success) return direct.data

  const key = s.toLowerCase().replace(/\s+/g, " ")
  if (key === "not received") return "Not received"
  if (key === "in progress") return "In Progress"
  if (key === "delivered") return "Delivered"

  return OrderStatusSchema.parse(s)
}

/**
 * Maps API order response to frontend Order model
 * Handles key name transformations and parsing
 */
export function mapApiOrderToOrder(apiOrder: APIOrder): Order {
  return {
    rowNumber: apiOrder.row_number,
    orderId: apiOrder["Order ID"],
    recipient: apiOrder.Recipient,
    phone: String(apiOrder.Phone),
    date: apiOrder.Date,
    location: apiOrder.Location,
    orderedArticlesRaw: apiOrder["Ordered articles"],
    orderedArticlesParsed: parseOrderedArticles(apiOrder["Ordered articles"]),
    totalPrice: apiOrder["Total price"],
    status: normalizeApiOrderStatus(apiOrder.Status),
    remark: apiOrder.Remark != null ? String(apiOrder.Remark) : undefined,
  }
}
