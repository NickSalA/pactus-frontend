import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        normal:
          "border border-slate-200 bg-neutral-50 text-foreground hover:bg-neutral-100",
        emphasized:
          "border border-transparent bg-brand-primary text-white hover:brightness-110",
      },
      size: {
        big: "px-4 py-3 gap-3 text-body-small-bold [&_svg:not([class*='size-'])]:size-5",
        normal: "px-4 py-3 gap-3 text-label-main-bold [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "normal",
      size: "normal",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  text?: string
}

function Button({
  className,
  variant = "normal",
  size = "normal",
  leftIcon,
  rightIcon,
  text,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {leftIcon}
      {text}
      {children}
      {rightIcon}
    </button>
  )
}

export { Button, buttonVariants }