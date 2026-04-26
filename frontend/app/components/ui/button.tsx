import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Button variants customized for the Luminous Minimalism design system.
 *
 * Variants:
 * - default (primary): Gradient fill per Glass & Gradient Rule
 * - secondary: surface-container-high background
 * - inverted: dark fill, white text
 * - outline: transparent bg with primary border
 * - ghost: transparent, hover reveals muted bg
 * - link: underlined text link
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out outline-none select-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white shadow-sm hover:brightness-110",
        secondary:
          "bg-[var(--surface-container-high)] text-[var(--primary)] hover:bg-[var(--surface-container)]",
        inverted:
          "bg-[var(--on-surface)] text-white hover:bg-[var(--on-surface)]/90",
        outline:
          "border-[1.5px] border-[var(--primary)] bg-transparent text-[var(--primary)] hover:bg-[var(--primary)]/5",
        ghost:
          "hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)]",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-4 py-2",
        xs: "h-6 gap-1 px-2 text-xs",
        sm: "h-8 gap-1 px-3 text-[0.8rem]",
        lg: "h-10 gap-2 px-5 text-sm",
        icon: "size-9",
        "icon-sm": "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
