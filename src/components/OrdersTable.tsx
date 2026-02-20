import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { StatusDropdown } from "./StatusDropdown"
import { Order, OrderStatus } from "@/types/order"
import { ArrowUpDown, Eye } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface OrdersTableProps {
  orders: Order[]
  onViewDetails: (order: Order) => void
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void
}

export function OrdersTable({
  orders,
  onViewDetails,
  onStatusChange,
}: OrdersTableProps) {
  const { t } = useTranslation()
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            {t("Order ID")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("orderId")}</div>
      ),
    },
    {
      accessorKey: "recipient",
      header: t("Recipient"),
      cell: ({ row }) => <div>{row.getValue("recipient")}</div>,
    },
    {
      accessorKey: "phone",
      header: t("Phone"),
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            {t("Date")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
    },
    {
      accessorKey: "location",
      header: t("Location"),
      cell: ({ row }) => <div>{row.getValue("location")}</div>,
    },
    {
      accessorKey: "totalPrice",
      header: t("Total Price"),
      cell: ({ row }) => {
        const price = row.getValue("totalPrice") as number
        return <div className="font-medium">{price} {t("RSD")}</div>
      },
    },
    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) => {
        const order = row.original
        return (
          <StatusDropdown
            currentStatus={order.status}
            onStatusChange={(newStatus) => {
              // TODO: Enable when mutation is implemented
              // onStatusChange?.(order.orderId, newStatus)
              console.log("Status change prepared:", {
                orderId: order.orderId,
                newStatus,
              })
            }}
            disabled={true} // Disabled until mutation is implemented
          />
        )
      },
    },
    {
      id: "actions",
      header: t("Actions"),
      cell: ({ row }) => {
        const order = row.original
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(order)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {t("View details")}
          </Button>
        )
      },
    },
  ]

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t("No orders found.")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
