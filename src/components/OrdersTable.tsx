import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusDropdown } from "./StatusDropdown";
import { Order, OrderStatus } from "@/types/order";
import { ArrowUpDown, Eye } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/** Parse API date strings for chronological sorting (ISO, DD.MM.YYYY, Date.parse fallbacks). */
function parseOrderDateForSort(dateStr: string): number {
  const s = dateStr.trim();
  const eu = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\b/);
  if (eu) {
    const d = Number(eu[1]);
    const m = Number(eu[2]);
    const y = Number(eu[3]);
    const t = new Date(y, m - 1, d).getTime();
    if (!Number.isNaN(t)) return t;
  }
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
}

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  onSelectionChange?: (selectedOrders: Order[]) => void;
}

function SelectCheckbox({
  checked,
  indeterminate = false,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      aria-label={ariaLabel}
      className="h-4 w-4 rounded border-border accent-primary"
    />
  );
}

export function OrdersTable({
  orders,
  onViewDetails,
  onSelectionChange,
}: OrdersTableProps) {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns: ColumnDef<Order>[] = useMemo(
    () => [
      {
        id: "select",
        enableSorting: false,
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <SelectCheckbox
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={(checked) => table.toggleAllRowsSelected(checked)}
              ariaLabel={t("Select all")}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <SelectCheckbox
              checked={row.getIsSelected()}
              onChange={(checked) => row.toggleSelected(checked)}
              ariaLabel={t("Select order")}
            />
          </div>
        ),
      },
      {
        accessorKey: "orderId",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2"
            >
              {t("Order ID")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
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
        id: "date",
        accessorFn: (row) => parseOrderDateForSort(row.date),
        sortingFn: "basic",
        sortDescFirst: true,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2"
            >
              {t("Date")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.date}</div>,
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
          const price = row.getValue("totalPrice") as number;
          return (
            <div className="font-medium">
              {price} {t("RSD")}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: t("Status"),
        cell: ({ row }) => {
          const order = row.original;
          return (
            <StatusDropdown
              currentStatus={order.status}
              onStatusChange={(newStatus) => {
                // TODO: Enable when mutation is implemented
                console.log("Status change prepared:", {
                  orderId: order.orderId,
                  newStatus,
                });
              }}
              disabled={true} // Disabled until mutation is implemented
            />
          );
        },
      },
      {
        id: "actions",
        header: t("Actions"),
        cell: ({ row }) => {
          const order = row.original;
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(order)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {t("View details")}
            </Button>
          );
        },
      },
  ],
    [t, onViewDetails],
  );

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.orderId,
    enableRowSelection: true,
    state: {
      sorting,
      rowSelection,
    },
  });

  useEffect(() => {
    if (!onSelectionChange) return;
    const selectedOrders = table.getSelectedRowModel().rows.map(
      (row) => row.original,
    );
    onSelectionChange(selectedOrders);
  }, [onSelectionChange, rowSelection, table]);

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-muted/60 hover:bg-muted/60 border-b-2 border-border"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-foreground font-semibold text-xs uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
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
  );
}
