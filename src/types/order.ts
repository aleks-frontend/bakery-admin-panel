import { z } from "zod"

/** Canonical statuses accepted by the status webhook and the UI. */
export const ORDER_STATUSES = ["Not received", "In Progress", "Delivered"] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const OrderStatusSchema = z.enum(ORDER_STATUSES)

/** n8n webhook: PATCH body is a one-element array wrapping `updates`. */
export const OrderStatusWebhookUpdateSchema = z.object({
  orderId: z.string(),
  status: OrderStatusSchema,
})

export const OrderStatusWebhookEnvelopeSchema = z.object({
  updates: z.array(OrderStatusWebhookUpdateSchema),
})

export const OrderStatusWebhookRequestSchema = OrderStatusWebhookEnvelopeSchema

export const OrderStatusWebhookResponseSchema = z.object({
  success: z.boolean(),
  updatedCount: z.number(),
})
export type OrderStatusWebhookResponse = z.infer<typeof OrderStatusWebhookResponseSchema>

// ParsedOrderItem schema
export const ParsedOrderItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
})
export type ParsedOrderItem = z.infer<typeof ParsedOrderItemSchema>

// Frontend Order model (camelCase)
export const OrderSchema = z.object({
  rowNumber: z.number(),
  orderId: z.string(),
  recipient: z.string(),
  phone: z.string(),
  date: z.string(),
  location: z.string(),
  orderedArticlesRaw: z.string(),
  orderedArticlesParsed: z.array(ParsedOrderItemSchema),
  totalPrice: z.number(),
  status: OrderStatusSchema,
  remark: z.string().optional(),
})
export type Order = z.infer<typeof OrderSchema>

// API Order model (raw API response shape)
export const APIOrderSchema = z.object({
  row_number: z.number(),
  "Order ID": z.string(),
  Recipient: z.string(),
  Phone: z.union([z.number(), z.string()]),
  Date: z.string(),
  Location: z.string(),
  "Ordered articles": z.string(),
  "Total price": z.number(),
  Status: z.string(),
  Remark: z.union([z.string(), z.number()]).optional(),
})
export type APIOrder = z.infer<typeof APIOrderSchema>
