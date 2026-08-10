import * as React from "react"
import { cn } from "@/lib/utils"

export const Text = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-white/60 font-normal leading-relaxed", className)} {...props} />
  )
)
Text.displayName = "Text"

export const Heading = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }>(
  ({ className, level = 2, ...props }, ref) => {
    const Component = `h${level}` as any
    return (
      <Component
        ref={ref}
        className={cn(
          "font-heading font-medium tracking-tight text-white",
          level === 1 && "text-5xl lg:text-7xl",
          level === 2 && "text-4xl lg:text-5xl",
          level === 3 && "text-2xl lg:text-3xl",
          className
        )}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"
