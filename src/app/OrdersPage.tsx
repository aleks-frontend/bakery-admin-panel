import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useOrdersQuery } from "@/hooks/useOrdersQuery"
import { OrdersTable } from "@/components/OrdersTable"
import { OrderDetailsModal } from "@/components/OrderDetailsModal"
import { Order, OrderStatus } from "@/types/order"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export function OrdersPage() {
  const { t } = useTranslation()
  const { data: orders = [], isLoading, error } = useOrdersQuery()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [workshopPdfLoading, setWorkshopPdfLoading] = useState(false)
  const [xlsLoading, setXlsLoading] = useState(false)

  const filteredOrders = useMemo(() => {
    let filtered = orders

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Filter by search query (recipient or phone)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.recipient.toLowerCase().includes(query) ||
          order.phone.includes(query)
      )
    }

    return filtered
  }, [orders, statusFilter, searchQuery])

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    // TODO: Implement when mutation is enabled
    console.log("Status change:", { orderId, newStatus })
  }

  async function handleGenerateWorkshopList() {
    if (!selectedOrders.length) return
    setWorkshopPdfLoading(true)
    try {
      const { downloadWorkshopListPdf } = await import(
        "@/components/WorkshopListPdf"
      )
      await downloadWorkshopListPdf(selectedOrders, {
        title: t("Workshop List"),
        generatedAt: t("Generated at"),
        total: t("Total"),
        noArticles: t("No articles"),
        unparsedLines: t("Unparsed lines"),
      })
    } catch (err) {
      console.error(err)
    } finally {
      setWorkshopPdfLoading(false)
    }
  }

  async function handleGenerateXls() {
    if (!selectedOrders.length) return
    setXlsLoading(true)
    try {
      const { downloadSelectedOrdersXls } = await import(
        "@/lib/exportSelectedOrdersXls"
      )
      downloadSelectedOrdersXls(selectedOrders)
    } catch (err) {
      console.error(err)
    } finally {
      setXlsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t("Loading orders...")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive font-medium mb-2">
              {t("Error loading orders")}
            </p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("Orders")}</h1>
        <p className="text-muted-foreground">
          {t("Manage bread and pastry orders")}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("Search by recipient or phone...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("Filter by status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All Statuses")}</SelectItem>
            <SelectItem value="Not received">{t("Not received")}</SelectItem>
            <SelectItem value="In progress">{t("In progress")}</SelectItem>
            <SelectItem value="Delivered">{t("Delivered")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("Showing {{count}} of {{total}} orders", {
              count: filteredOrders.length,
              total: orders.length,
            })}
          </p>
        </div>
        <OrdersTable
          orders={filteredOrders}
          onViewDetails={handleViewDetails}
          onStatusChange={handleStatusChange}
          onSelectionChange={setSelectedOrders}
        />
      </div>

      {selectedOrders.length > 0 ? (
        <div className="fixed inset-x-0 bottom-4 z-20 flex justify-center px-4">
          <div className="flex w-full max-w-3xl flex-col gap-3 rounded-lg border bg-background/95 px-4 py-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-sm font-medium">
              {t("{{count}} selected", { count: selectedOrders.length })}
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <Button
                type="button"
                onClick={handleGenerateWorkshopList}
                disabled={workshopPdfLoading}
              >
                {workshopPdfLoading
                  ? t("Generating PDF...")
                  : t("Generate Workshop List")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleGenerateXls}
                disabled={xlsLoading}
              >
                {xlsLoading ? t("Generating XLS...") : t("Generate XLS")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Order details modal */}
      <OrderDetailsModal
        order={selectedOrder}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}
