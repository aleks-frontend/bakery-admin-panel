import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getApiBaseUrl, patchOrdersStatusUpdate } from "@/lib/api"
import { OrderStatus } from "@/types/order"

const ORDERS_STATUS_WEBHOOK_PATH = "webhook/bakery/orders/status"

function ordersStatusPatchUrl(): string {
  return `${getApiBaseUrl()}/${ORDERS_STATUS_WEBHOOK_PATH}`
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { orderIds: string[]; newStatus: OrderStatus }) =>
      patchOrdersStatusUpdate(
        input.orderIds.map((orderId) => ({ orderId, status: input.newStatus })),
        ordersStatusPatchUrl(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}
