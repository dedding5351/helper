import * as React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { IssueRow, Issue } from "../components/IssueRow";
import { KanbanBoard } from "../components/KanbanBoard";
import { IssueDetailModal } from "../components/IssueDetailModal";

const activeIssues: Issue[] = [
  {
    id: "IT-421",
    title: "SSO Login failing for regional office",
    status: "In Progress",
    priority: "High",
    assignee: "Mike Chen",
    time: "1h ago",
  },
  {
    id: "IT-423",
    title: "Network timeout on staging database",
    status: "Auto-Escalated",
    priority: "High",
    assignee: "Sarah Jenkins",
    time: "2m ago",
  },
  {
    id: "IT-425",
    title: "VPN Client not connecting on macOS Sequoia",
    status: "Open",
    priority: "Medium",
    time: "30m ago",
  },
  {
    id: "IT-419",
    title: "Update security groups for new microservice",
    status: "In Progress",
    priority: "Medium",
    assignee: "Sarah Jenkins",
    time: "4h ago",
  },
];

export default async function ActiveIssuesPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const params = await searchParams;
  const isBoardView = params.view === "board";

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="flex h-20 shrink-0 items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Active Issues
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative flex w-64 items-center">
            <span className="material-symbols-outlined absolute left-3 text-[18px] text-muted-foreground">
              search
            </span>
            <input
              type="search"
              placeholder="Search active..."
              className="h-10 w-full rounded-md border border-outline-variant/15 bg-surface-container-lowest pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          
          <div className="flex items-center gap-1 rounded-lg bg-[#eaeff2] p-1">
            <Link 
              href="/it/active?view=list" 
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                !isBoardView ? 'bg-[#ffffff] text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">list</span>
              List
            </Link>
            <Link 
              href="/it/active?view=board" 
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                isBoardView ? 'bg-[#ffffff] text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              Board
            </Link>
          </div>
        </div>
      </header>

      {isBoardView ? (
        <main className="flex-1 overflow-hidden">
          <KanbanBoard issues={activeIssues} />
        </main>
      ) : (
        <>
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
              {activeIssues.map((issue) => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
            </div>
          </main>
        </>
      )}

      {/* Modal wrapped in Suspense for useSearchParams */}
      <Suspense fallback={null}>
        <IssueDetailModal />
      </Suspense>
    </div>
  );
}
