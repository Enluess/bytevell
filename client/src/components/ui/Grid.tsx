import * as React from "react"
import { cn } from "@/lib/utils"

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number
  gap?: string | number
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          cols && `grid-cols-${cols}`,
          gap && `gap-${gap}`,
          className
        )}
        {...props}
      />
    )
  }
)
Grid.displayName = "Grid"
