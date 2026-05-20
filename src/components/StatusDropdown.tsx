import { useState } from "react"
import { StatusBadge } from "./StatusBadge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ORDER_STATUSES, OrderStatus } from "@/types/order"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StatusDropdownProps {
  currentStatus: OrderStatus
  onStatusChange: (newStatus: OrderStatus) => void
  disabled?: boolean
}

export function StatusDropdown({
  currentStatus,
  onStatusChange,
  disabled = false,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleStatusSelect = (status: OrderStatus) => {
    if (!disabled) {
      onStatusChange(status)
    }
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent"
          disabled={disabled}
        >
          <StatusBadge status={currentStatus} />
          {!disabled && (
            <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {ORDER_STATUSES.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusSelect(status)}
            className="cursor-pointer"
          >
            <StatusBadge status={status} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
