import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/90 text-primary-foreground hover:bg-primary hover:shadow-sm hover:scale-105",
        secondary:
          "border-transparent bg-secondary/80 backdrop-blur-sm text-secondary-foreground hover:bg-secondary/90 hover:shadow-sm hover:scale-105",
        destructive:
          "border-transparent bg-destructive/90 text-destructive-foreground hover:bg-destructive hover:shadow-sm hover:scale-105",
        outline: "text-foreground border-border/50 bg-background/60 hover:bg-background/80 hover:shadow-sm hover:scale-105",
        glass: "border-glass-border bg-glass/80 backdrop-blur-md text-foreground hover:bg-glass/90 hover:shadow-glass-sm hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
