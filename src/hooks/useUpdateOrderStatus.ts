import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOrderStatus } from "@/lib/api"
import { Order, OrderStatus } from "@/types/order"

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, newStatus }: { orderId: string; newStatus: OrderStatus }) =>
      updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      // Invalidate and refetch orders after successful update
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}
