import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground ring-border",
        active: "bg-success/10 text-success ring-success/20",
        pending: "bg-warning/10 text-warning ring-warning/20", 
        inactive: "bg-muted text-muted-foreground ring-border",
        critical: "bg-destructive/10 text-destructive ring-destructive/20",
        approved: "bg-success/10 text-success ring-success/20",
        rejected: "bg-destructive/10 text-destructive ring-destructive/20",
        underReview: "bg-warning/10 text-warning ring-warning/20",
        initiated: "bg-primary/10 text-primary ring-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ variant }), className)} {...props} />
  )
}

export { StatusBadge, statusBadgeVariants }