"use client";

import Link from "next/link";
import { Issue } from "@/app/it/services/issue.service";

const STATUS_COPY: Record<string, { label: string; tone: string }> = {
  Open: { label: "Awaiting Triage", tone: "text-muted-foreground" },
  "Auto-Escalated": { label: "Routed to IT", tone: "text-amber-700" },
  "In Progress": { label: "Being Investigated", tone: "text-primary" },
  Blocked: { label: "Blocked", tone: "text-destructive" },
  Resolved: { label: "Resolved", tone: "text-emerald-700" },
};

function formatRelative(dateString: string): string {
  const date = new Date(
    dateString.endsWith("Z") ? dateString : dateString + "Z",
  );
  const diff = Date.now() - date.getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.round(hr / 24);
  return `${days}d ago`;
}

export function UserTicketRow({ issue }: { issue: Issue }) {
  const status = STATUS_COPY[issue.status] ?? {
    label: issue.status,
    tone: "text-muted-foreground",
  };

  return (
    <Link
      href={`/user/tickets?issue=${issue.id}`}
      className="group flex items-center justify-between gap-4 rounded-xl bg-card px-6 py-4 shadow-[0_2px_12px_rgba(44,52,55,0.03)] transition-shadow hover:shadow-[0_8px_24px_rgba(44,52,55,0.06)]"
    >
      <div className="flex flex-1 items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            confirmation_number
          </span>
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {issue.id}
          </span>
          <span
            className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary"
            style={{ letterSpacing: "-0.01em" }}
          >
            {issue.title}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end gap-0.5">
          <span
            className={`text-[11px] font-semibold uppercase tracking-widest ${status.tone}`}
          >
            {status.label}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {issue.assignee ? `Assigned to ${issue.assignee}` : "Unassigned"}
          </span>
        </div>
        <div className="w-20 text-right text-xs text-muted-foreground">
          {formatRelative(issue.createdAt)}
        </div>
      </div>
    </Link>
  );
}
