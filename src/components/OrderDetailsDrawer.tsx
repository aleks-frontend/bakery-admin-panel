import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Order } from "@/types/order"
import { StatusBadge } from "./StatusBadge"
import { Separator } from "@/components/ui/separator"

interface OrderDetailsDrawerProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDrawer({
  order,
  open,
  onOpenChange,
}: OrderDetailsDrawerProps) {
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order ID: {order.orderId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Recipient
              </p>
              <p className="text-sm">{order.recipient}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Phone
              </p>
              <p className="text-sm">{order.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Date
              </p>
              <p className="text-sm">{order.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Location
              </p>
              <p className="text-sm">{order.location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <div className="mt-1">
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Price
              </p>
              <p className="text-sm font-semibold">{order.totalPrice} RSD</p>
            </div>
          </div>

          {order.remark && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Remark
                </p>
                <p className="text-sm">{order.remark}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Ordered Articles */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Ordered Articles
            </p>
            <div className="space-y-2">
              {order.orderedArticlesParsed.length > 0 ? (
                order.orderedArticlesParsed.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">{item.price} RSD</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  {order.orderedArticlesRaw || "No articles"}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
