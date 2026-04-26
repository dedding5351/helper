import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

/**
 * FeatureCard — A card for the "Architected for Clarity" features grid.
 *
 * Uses the shadcn Card primitive with Luminous Minimalism overrides:
 * - No border (No-Line Rule)
 * - Tonal layering (white card on surface-container-low)
 * - Ambient shadow for lift
 * - Icon in a small colored rounded square
 */
export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card className={cn("gap-5 p-7", className)}>
      <CardHeader className="gap-3">
        {/* Icon container — small rounded square with primary bg */}
        <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
          {icon}
        </div>
        <CardTitle className="text-base font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardDescription className="leading-relaxed">
        {description}
      </CardDescription>
    </Card>
  );
}
