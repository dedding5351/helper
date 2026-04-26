import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Badge customized for Luminous Minimalism.
 * 
 * The "chip" variant is specifically for the hero section badge
 * with Ghost Border styling and uppercase label typography.
 */
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden border border-transparent px-3 py-1 text-xs font-medium whitespace-nowrap transition-all [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-[var(--primary)] text-white",
        secondary:
          "rounded-full bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]",
        outline:
          "rounded-full border-[var(--outline-variant)]/15 text-[var(--on-surface-variant)]",
        chip:
          "rounded-full border-[var(--outline-variant)]/15 bg-[var(--surface-container-lowest)] text-[var(--on-surface)] tracking-[0.05em] uppercase text-[0.7rem] font-medium shadow-[var(--shadow-ambient)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
