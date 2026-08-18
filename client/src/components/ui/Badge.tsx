import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "primary"
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors",
          variant === "default" && "bg-surface border border-border text-foreground-secondary",
          variant === "outline" && "border border-border text-foreground-muted",
          variant === "primary" && "bg-primary/10 text-primary border border-primary/20",
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"
