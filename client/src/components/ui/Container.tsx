import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl"
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "7xl", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "container mx-auto px-6",
          size === "7xl" ? "max-w-7xl" : `max-w-${size}`,
          className
        )}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"
