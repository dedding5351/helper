"use client";

import * as React from "react";
import { Suspense } from "react";
import { IssueService, Issue } from "@/app/it/services/issue.service";
import { UserTicketRow } from "../../components/UserTicketRow";
import { UserTicketDetailModal } from "../../components/UserTicketDetailModal";

const CURRENT_USER = "default-user";

type Filter = "all" | "open" | "resolved";

const FILTERS: Array<{ key: Filter; label: string; statuses?: string }> = [
  { key: "all", label: "All" },
  {
    key: "open",
    label: "Open",
    statuses: "Open,Auto-Escalated,In Progress,Blocked",
  },
  { key: "resolved", label: "Resolved", statuses: "Resolved" },
];

export default function UserTicketsPage() {
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<Filter>("all");

  const loadIssues = React.useCallback(async () => {
    setLoading(true);
    try {
      const statuses = FILTERS.find((f) => f.key === filter)?.statuses;
      const response = await IssueService.getIssues({
        requester: CURRENT_USER,
        status: statuses,
      });
      setIssues(response.data);
    } catch (error) {
      console.error("Failed to load tickets", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  React.useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  // Reload when the detail modal closes (so status changes from IT show up).
  React.useEffect(() => {
    const handle = () => loadIssues();
    window.addEventListener("focus", handle);
    return () => window.removeEventListener("focus", handle);
  }, [loadIssues]);

  return (
    <>
      <header className="flex flex-col gap-4 px-8 py-8 md:px-12">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              My Tickets
            </span>
            <h1
              className="mt-1 text-3xl font-bold tracking-tight text-foreground"
              style={{ letterSpacing: "-0.02em" }}
            >
              Track your requests
            </h1>
          </div>
        </div>

        <nav className="flex gap-6 text-sm font-medium">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`pb-1 transition-colors ${
                filter === f.key
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 px-8 pb-16 md:px-12">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
          {loading ? (
            <div className="rounded-xl bg-card p-8 text-center text-sm text-muted-foreground shadow-[0_2px_12px_rgba(44,52,55,0.03)]">
              Loading tickets...
            </div>
          ) : issues.length === 0 ? (
            <div className="rounded-xl bg-card p-12 text-center shadow-[0_2px_12px_rgba(44,52,55,0.03)]">
              <span className="material-symbols-outlined text-[36px] text-muted-foreground/60">
                inbox
              </span>
              <p className="mt-3 text-sm text-muted-foreground">
                You don&apos;t have any tickets yet. Use{" "}
                <span className="font-semibold text-foreground">
                  New Request
                </span>{" "}
                to escalate something to IT.
              </p>
            </div>
          ) : (
            issues.map((issue) => (
              <UserTicketRow key={issue.id} issue={issue} />
            ))
          )}
        </div>
      </main>

      <Suspense fallback={null}>
        <UserTicketDetailModal />
      </Suspense>
    </>
  );
}
