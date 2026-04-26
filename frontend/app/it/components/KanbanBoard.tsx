"use client";

import * as React from "react";
import { Issue } from "./IssueRow";
import { KanbanCard } from "./KanbanCard";

type Column = {
  id: string;
  title: string;
  statusMapped: Issue["status"];
  issues: Issue[];
};

export function KanbanBoard({ issues: initialIssues }: { issues: Issue[] }) {
  const [issues, setIssues] = React.useState<Issue[]>(initialIssues);

  // Derive columns from state
  const columns: Column[] = [
    {
      id: "triage",
      title: "Triage",
      statusMapped: "Open",
      issues: issues.filter(i => i.status === "Open" || i.status === "Auto-Escalated"),
    },
    {
      id: "in-progress",
      title: "In Progress",
      statusMapped: "In Progress",
      issues: issues.filter(i => i.status === "In Progress"),
    },
    {
      id: "blocked",
      title: "Blocked",
      statusMapped: "Blocked",
      issues: issues.filter(i => i.status === "Blocked"),
    },
    {
      id: "in-review",
      title: "In Review",
      statusMapped: "Resolved",
      issues: issues.filter(i => i.status === "Resolved"),
    },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, statusMapped: Issue["status"]) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData("issueId");
    
    if (issueId) {
      setIssues(prev => prev.map(issue => {
        if (issue.id === issueId) {
          // If moving from Auto-Escalated to Triage, it naturally becomes 'Open'
          return { ...issue, status: statusMapped };
        }
        return issue;
      }));
    }
  };

  return (
    <div className="flex h-full w-full gap-6 overflow-x-auto px-8 pb-8">
      {columns.map((col) => (
        <div key={col.id} className="flex w-[320px] shrink-0 flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">{col.title}</h3>
            <span className="flex h-5 items-center justify-center rounded-full bg-secondary/10 px-2 text-[10px] font-bold text-muted-foreground">
              {col.issues.length}
            </span>
          </div>
          
          <div 
            className="flex flex-1 flex-col gap-3 rounded-xl bg-[#f0f4f7]/50 p-3 transition-colors hover:bg-[#eaeff2]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.statusMapped)}
          >
            {col.issues.map(issue => (
              <KanbanCard key={issue.id} issue={issue} />
            ))}
            {col.issues.length === 0 && (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-outline-variant/20 bg-transparent pointer-events-none">
                <span className="text-xs text-muted-foreground">Drop issues here</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
