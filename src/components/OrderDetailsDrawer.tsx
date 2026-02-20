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
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Order Details")}</DialogTitle>
          <DialogDescription>
            {t("Order ID: {{orderId}}", { orderId: order.orderId })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("Recipient")}
              </p>
              <p className="text-sm">{order.recipient}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("Phone")}
              </p>
              <p className="text-sm">{order.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("Date")}
              </p>
              <p className="text-sm">{order.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("Location")}
              </p>
              <p className="text-sm">{order.location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("Status")}
              </p>
              <div className="mt-1">
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("Total Price")}
              </p>
              <p className="text-sm font-semibold">{order.totalPrice} {t("RSD")}</p>
            </div>
          </div>

          {order.remark && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t("Remark")}
                </p>
                <p className="text-sm">{order.remark}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Ordered Articles */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">
              {t("Ordered Articles")}
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
                        {t("Quantity: {{quantity}}", { quantity: item.quantity })}
                      </p>
                    </div>
                    <p className="font-semibold">{item.price} {t("RSD")}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  {order.orderedArticlesRaw || t("No articles")}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
