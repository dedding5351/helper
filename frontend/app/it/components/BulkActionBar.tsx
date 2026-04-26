"use client";

import * as React from "react";
import { IssueService, IssueStatus, IssuePriority } from "../services/issue.service";

interface BulkActionBarProps {
  selectedCount: number;
  selectedIds: string[];
  onComplete: () => void;
  onDeselectAll: () => void;
}

export function BulkActionBar({ 
  selectedCount, 
  selectedIds, 
  onComplete,
  onDeselectAll
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  const handleStatusChange = async (status: IssueStatus) => {
    try {
      await IssueService.bulkUpdateIssues(selectedIds, { status });
      onComplete();
    } catch (error) {
      console.error("Bulk status update failed", error);
    }
  };

  const handlePriorityChange = async (priority: IssuePriority) => {
    try {
      await IssueService.bulkUpdateIssues(selectedIds, { priority });
      onComplete();
    } catch (error) {
      console.error("Bulk priority update failed", error);
    }
  };

  const handleAssigneeChange = async (assignee: string) => {
    try {
      await IssueService.bulkUpdateIssues(selectedIds, { assignee: assignee === "" ? null : assignee });
      onComplete();
    } catch (error) {
      console.error("Bulk assignee update failed", error);
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 items-center gap-6 rounded-2xl bg-white/90 px-6 py-3 shadow-[0_20px_40px_rgba(44,52,55,0.08)] backdrop-blur-xl border border-white/20">
      <div className="flex items-center gap-3 pr-4 border-r border-secondary/10">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[12px] font-bold text-primary">
          {selectedCount}
        </span>
        <span className="text-sm font-semibold text-foreground">Selected</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Status</span>
          <select
            className="bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer hover:text-primary transition-colors appearance-none pr-4"
            onChange={(e) => handleStatusChange(e.target.value as IssueStatus)}
            value=""
          >
            <option value="" disabled>Change Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Auto-Escalated">Auto-Escalated</option>
          </select>
        </div>

        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Priority</span>
          <select
            className="bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer hover:text-primary transition-colors appearance-none pr-4"
            onChange={(e) => handlePriorityChange(e.target.value as IssuePriority)}
            value=""
          >
            <option value="" disabled>Change Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Assignee</span>
          <select
            className="bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer hover:text-primary transition-colors appearance-none pr-4"
            onChange={(e) => handleAssigneeChange(e.target.value)}
            value=""
          >
            <option value="" disabled>Set Assignee</option>
            <option value="">Unassigned</option>
            <option value="Sarah Jenkins">Sarah Jenkins</option>
            <option value="System">System</option>
          </select>
        </div>
      </div>

      <button
        onClick={onDeselectAll}
        className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-muted-foreground hover:bg-secondary/20 hover:text-foreground transition-all"
        title="Deselect all"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
