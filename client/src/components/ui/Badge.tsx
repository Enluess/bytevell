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
          "inline-flex items-center px-4 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-colors",
          variant === "default" && "bg-white/[0.03] border border-white/[0.05] text-white/70",
          variant === "outline" && "border border-white/10 text-white/60",
          variant === "primary" && "bg-primary/10 text-primary border border-primary/20",
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"
