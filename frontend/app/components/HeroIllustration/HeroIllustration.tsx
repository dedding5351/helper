import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

/**
 * HeroIllustration — A decorative, CSS-only illustration for the hero section.
 *
 * Depicts a floating mock-UI panel with a notification card and auto-escalated
 * label, providing asymmetrical visual weight per DESIGN_SYSTEM §6.
 *
 * This is a Server Component — no client interactivity needed.
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full max-w-md",
        className
      )}
      aria-hidden="true"
    >
      {/* Outer floating panel */}
      <div className="animate-float rounded-xl bg-[var(--surface-container-low)] p-6 shadow-[var(--shadow-ambient)]">
        {/* Mock toolbar bar */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2.5 w-24 rounded-full bg-[var(--surface-container-high)]" />
          <div className="h-2.5 w-16 rounded-full bg-[var(--surface-container-high)]" />
          <div className="h-2.5 w-10 rounded-full bg-[var(--surface-container-high)]" />
        </div>

        {/* Primary progress bar */}
        <div className="mb-3 h-2 w-full rounded-full bg-[var(--surface-container-high)]">
          <div className="h-2 w-3/4 rounded-full bg-[var(--primary)]" />
        </div>

        {/* Secondary progress bar */}
        <div className="mb-6 h-1.5 w-full rounded-full bg-[var(--surface-container-high)]">
          <div className="h-1.5 w-full rounded-full bg-[var(--primary)]/60" />
        </div>

        {/* Notification card */}
        <div className="mb-4 inline-flex items-center gap-3 rounded-lg bg-[var(--surface-container-lowest)] px-4 py-3 shadow-[var(--shadow-ambient)]">
          <div className="flex size-8 items-center justify-center rounded-full bg-[var(--primary)]/10">
            <CheckCircle className="size-4 text-[var(--primary)]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--on-surface)]">
              Issue Resolved
            </p>
            <p className="text-xs text-[var(--on-surface-variant)]">
              Network timeout fixed.
            </p>
          </div>
        </div>

        {/* Auto-escalated label */}
        <div className="flex justify-end">
          <span className="text-[0.65rem] font-medium tracking-[0.12em] text-[var(--on-surface-variant)] uppercase">
            Auto-Escalated
          </span>
        </div>
      </div>
    </div>
  );
}
