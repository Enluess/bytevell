import * as React from "react"
import { cn } from "@/lib/utils"

export const Text = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-foreground-secondary font-normal leading-relaxed text-[14px]", className)} {...props} />
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
          "font-sans font-semibold tracking-tight text-foreground",
          level === 1 && "text-3xl lg:text-4xl",
          level === 2 && "text-2xl lg:text-3xl",
          level === 3 && "text-xl lg:text-2xl",
          className
        )}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"
