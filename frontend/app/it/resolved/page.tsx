import * as React from "react";
import { Suspense } from "react";
import { IssueRow, Issue } from "../components/IssueRow";
import { IssueDetailModal } from "../components/IssueDetailModal";

const resolvedIssues: Issue[] = [
  {
    id: "IT-420",
    title: "Monitor replacement needed - Desk 4B",
    status: "Resolved",
    priority: "Low",
    assignee: "Sarah Jenkins",
    time: "3h ago",
  },
  {
    id: "IT-418",
    title: "Access request for AWS Production env",
    status: "Resolved",
    priority: "High",
    assignee: "Mike Chen",
    time: "1d ago",
  },
  {
    id: "IT-412",
    title: "Jira webhook not firing on ticket transition",
    status: "Resolved",
    priority: "Medium",
    time: "2d ago",
  },
];

export default function ResolvedPage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="flex h-20 shrink-0 items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Resolved
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex w-64 items-center">
            <span className="material-symbols-outlined absolute left-3 text-[18px] text-muted-foreground">
              search
            </span>
            <input
              type="search"
              placeholder="Search resolved..."
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
          {resolvedIssues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} />
          ))}
        </div>
      </main>

      <Suspense fallback={null}>
        <IssueDetailModal />
      </Suspense>
    </div>
  );
}
