import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-md border border-border bg-surface-elevated hover:border-border-strong transition-all duration-200",
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"
