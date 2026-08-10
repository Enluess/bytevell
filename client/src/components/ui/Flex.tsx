import * as React from "react"
import { cn } from "@/lib/utils"

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  col?: boolean
  items?: "start" | "end" | "center" | "baseline" | "stretch"
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly"
  wrap?: "nowrap" | "wrap" | "wrap-reverse"
  gap?: string | number
  inline?: boolean
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, col, items, justify, wrap, gap, inline, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          inline ? "inline-flex" : "flex",
          col ? "flex-col" : "flex-row",
          items && `items-${items}`,
          justify && (justify === "between" ? "justify-between" : justify === "around" ? "justify-around" : justify === "evenly" ? "justify-evenly" : `justify-${justify}`),
          wrap && `flex-${wrap}`,
          gap && `gap-${gap}`,
          className
        )}
        {...props}
      />
    )
  }
)
Flex.displayName = "Flex"
