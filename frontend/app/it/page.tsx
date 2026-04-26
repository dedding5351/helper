import * as React from "react";
import { Suspense } from "react";
import { IssueRow, Issue } from "./components/IssueRow";
import { IssueDetailModal } from "./components/IssueDetailModal";

const dummyIssues: Issue[] = [
  {
    id: "IT-423",
    title: "Network timeout on staging database",
    status: "Auto-Escalated",
    priority: "High",
    assignee: "Sarah Jenkins",
    time: "2m ago",
  },
  {
    id: "IT-422",
    title: "Request for new Adobe CC license",
    status: "Open",
    priority: "Medium",
    time: "15m ago",
  },
  {
    id: "IT-421",
    title: "SSO Login failing for regional office",
    status: "In Progress",
    priority: "High",
    assignee: "Mike Chen",
    time: "1h ago",
  },
  {
    id: "IT-420",
    title: "Monitor replacement needed - Desk 4B",
    status: "Resolved",
    priority: "Low",
    assignee: "Sarah Jenkins",
    time: "3h ago",
  },
];

export default function ITDashboardPage() {
  return (
    <>
      {/* Top bar */}
      <header className="flex h-20 shrink-0 items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Inbox
          </h1>
          <nav className="mt-1 flex gap-6 text-sm font-medium">
            <button className="text-foreground border-b-2 border-primary pb-1">Unassigned (1)</button>
            <button className="text-muted-foreground pb-1 transition-colors hover:text-foreground">Assigned to Me (2)</button>
            <button className="text-muted-foreground pb-1 transition-colors hover:text-foreground">All (4)</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex w-64 items-center">
            <span className="material-symbols-outlined absolute left-3 text-[18px] text-muted-foreground">
              search
            </span>
            <input
              type="search"
              placeholder="Search tickets..."
              className="h-10 w-full rounded-md border border-outline-variant/15 bg-surface-container-lowest pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>
      </header>

      {/* List Header */}
      <div className="flex items-center justify-between gap-4 px-8 py-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <div className="flex flex-1 items-center gap-4">
          <div className="w-6 text-center">Pri</div>
          <div className="w-16">ID</div>
          <div className="flex-1">Title</div>
        </div>
        <div className="flex items-center gap-8">
          <div className="w-32">Status</div>
          <div className="w-32">Assignee</div>
          <div className="w-16 text-right">Time</div>
        </div>
      </div>

      {/* List Content */}
      <main className="flex-1 overflow-auto">
        <div className="flex flex-col pb-8">
          {dummyIssues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} />
          ))}
        </div>
      </main>

      {/* Modal wrapped in Suspense for useSearchParams */}
      <Suspense fallback={null}>
        <IssueDetailModal />
      </Suspense>
    </>
  );
}
