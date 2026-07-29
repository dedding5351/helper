"use client";

import * as React from "react";
import { Suspense, useEffect, useState } from "react";
import { IssueRow } from "./components/IssueRow";
import { IssueDetailModal } from "./components/IssueDetailModal";
import { BulkActionBar } from "./components/BulkActionBar";
import { IssueService, Issue } from "./services/issue.service";
import { useSelection } from "./hooks/useSelection";

export default function ITDashboardPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"unassigned" | "me" | "all">("all");
  const { selectedIds, toggle, selectAll, deselectAll, isSelected, count } = useSelection();

  async function loadIssues() {
    setLoading(true);
    try {
      let assignee;
      if (filter === "unassigned") assignee = "null";
      if (filter === "me") assignee = "Sarah Jenkins";
      
      const response = await IssueService.getIssues(assignee ? { assignee } : undefined);
      setIssues(response.data);
    } catch (error) {
      console.error("Failed to load issues", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadIssues();
    }, 0);

    return () => clearTimeout(timer);
  }, [filter]);

  return (
    <>
      {/* Top bar */}
      <header className="flex h-20 shrink-0 items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Inbox
          </h1>
          <nav className="mt-1 flex gap-6 text-sm font-medium">
            <button 
              onClick={() => setFilter("unassigned")}
              className={`pb-1 transition-colors ${filter === "unassigned" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Unassigned
            </button>
            <button 
              onClick={() => setFilter("me")}
              className={`pb-1 transition-colors ${filter === "me" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Assigned to Me
            </button>
            <button 
              onClick={() => setFilter("all")}
              className={`pb-1 transition-colors ${filter === "all" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              All
            </button>
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
          <div className="w-6 flex justify-center">
            <button
              onClick={() => {
                if (count === issues.length && issues.length > 0) {
                  deselectAll();
                } else {
                  selectAll(issues.map(i => i.id));
                }
              }}
              className={`h-4 w-4 rounded-sm border transition-all ${
                count === issues.length && issues.length > 0
                  ? "bg-primary border-primary text-white flex items-center justify-center"
                  : "border-muted-foreground/30 hover:border-muted-foreground/60"
              }`}
            >
              {count === issues.length && issues.length > 0 && (
                <span className="material-symbols-outlined text-[12px] font-bold">check</span>
              )}
            </button>
          </div>
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
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading tickets...</div>
          ) : issues.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No tickets found.</div>
          ) : (
            issues.map((issue) => (
              <IssueRow 
                key={issue.id} 
                issue={issue} 
                selected={isSelected(issue.id)}
                onToggle={toggle}
              />
            ))
          )}
        </div>
      </main>

      <Suspense fallback={null}>
        <IssueDetailModal />
      </Suspense>

      <BulkActionBar 
        selectedCount={count}
        selectedIds={Array.from(selectedIds)}
        onDeselectAll={deselectAll}
        onComplete={() => {
          deselectAll();
          loadIssues();
        }}
      />
    </>
  );
}
