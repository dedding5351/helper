"use client";

import * as React from "react";
import { Issue } from "../services/issue.service";

export function KanbanCard({ issue }: { issue: Issue }) {
  function getPriorityIcon(priority: Issue["priority"]) {
    switch (priority) {
      case "High":
        return <span className="material-symbols-outlined text-[16px] text-[#8C6C94]">stat_3</span>;
      case "Medium":
        return <span className="material-symbols-outlined text-[16px] text-muted-foreground">stat_2</span>;
      case "Low":
        return <span className="material-symbols-outlined text-[16px] text-muted-foreground/50">stat_1</span>;
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("issueId", issue.id);
    e.dataTransfer.effectAllowed = "move";
    
    // Slight visual feedback during drag
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = "0.5";
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = "1";
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="group relative flex cursor-grab flex-col gap-3 rounded-lg bg-[#ffffff] p-4 shadow-[0_10px_30px_rgba(44,52,55,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(44,52,55,0.06)] active:cursor-grabbing active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-muted-foreground">{issue.id}</span>
        {getPriorityIcon(issue.priority)}
      </div>
      <h4 className="text-sm font-semibold tracking-tight text-foreground leading-snug">
        {issue.title}
      </h4>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {issue.assignee ? (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/20 text-[10px] font-bold text-secondary-foreground">
              {issue.assignee.charAt(0)}
            </div>
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground/50">
              <span className="material-symbols-outlined text-[12px]">person</span>
            </div>
          )}
          <span className="text-xs text-muted-foreground">{issue.assignee || "Unassigned"}</span>
        </div>
        <span className="text-xs text-muted-foreground/60">{new Date(issue.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
