import * as React from "react";
import { Suspense } from "react";
import { IssueRow, Issue } from "../components/IssueRow";
import { IssueDetailModal } from "../components/IssueDetailModal";

const escalatedIssues: Issue[] = [
  {
    id: "IT-423",
    title: "Network timeout on staging database",
    status: "Auto-Escalated",
    priority: "High",
    assignee: "Sarah Jenkins",
    time: "2m ago",
  },
  {
    id: "IT-415",
    title: "Cannot provision user via Okta API",
    status: "Auto-Escalated",
    priority: "High",
    time: "5h ago",
  },
];

export default function EscalationsPage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-primary/5 border-b border-primary/10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[24px] text-primary">warning</span>
          <h1 className="text-2xl font-bold tracking-tight text-primary" style={{ letterSpacing: "-0.02em" }}>
            AI Escalations
          </h1>
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
          {escalatedIssues.map((issue) => (
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
