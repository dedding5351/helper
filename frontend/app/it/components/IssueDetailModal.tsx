"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IssueService, IssueDetails } from "../services/issue.service";

export function IssueDetailModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const issueId = searchParams.get("issue");
  
  const [issue, setIssue] = React.useState<IssueDetails | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const [posting, setPosting] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && issueId) {
        router.push("/it");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [issueId, router]);

  React.useEffect(() => {
    if (issueId) {
      setLoading(true);
      IssueService.getIssueById(issueId)
        .then(res => setIssue(res.data))
        .catch(err => console.error("Failed to load issue details", err))
        .finally(() => setLoading(false));
    } else {
      setIssue(null);
    }
  }, [issueId]);

  const handlePostComment = async () => {
    if (!issueId || !commentText.trim() || !issue) return;
    
    setPosting(true);
    try {
      const event = await IssueService.addIssueComment(issueId, commentText);
      setIssue({
        ...issue,
        activityFeed: [...issue.activityFeed, event]
      });
      setCommentText("");
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setPosting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!issue) return;
    try {
      await IssueService.updateIssue(issue.id, { status: newStatus as any });
      const updatedIssue = await IssueService.getIssueById(issue.id);
      setIssue(updatedIssue.data);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!issue) return;
    try {
      await IssueService.updateIssue(issue.id, { priority: newPriority as any });
      const updatedIssue = await IssueService.getIssueById(issue.id);
      setIssue(updatedIssue.data);
    } catch (error) {
      console.error("Failed to update priority", error);
    }
  };

  const handleAssigneeChange = async (newAssignee: string) => {
    if (!issue) return;
    try {
      await IssueService.updateIssue(issue.id, { assignee: newAssignee === "" ? undefined : newAssignee });
      const updatedIssue = await IssueService.getIssueById(issue.id);
      setIssue(updatedIssue.data);
    } catch (error) {
      console.error("Failed to update assignee", error);
    }
  };

  if (!issueId || !issue) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[#f7f9fb]/40 backdrop-blur-[2px] transition-opacity"
        onClick={() => router.push("/it")}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl transform bg-[#ffffff]/90 p-8 shadow-[0_0_60px_rgba(44,52,55,0.08)] backdrop-blur-xl transition-transform duration-300 ease-in-out sm:p-12 border-l border-white/20"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-8">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select 
                  className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground outline-none border-none cursor-pointer"
                  value={issue.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Auto-Escalated">Auto-Escalated</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  {issue.id}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
                title="Copy Link"
              >
                <span className="material-symbols-outlined text-[18px]">link</span>
              </button>
              <button
                onClick={() => router.push("/it")}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
                title="Close (Esc)"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Title */}
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <span className="text-muted-foreground text-sm">Loading issue details...</span>
            </div>
          ) : issue ? (
            <>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>
                {issue.title}
              </h2>

              <div className="mb-8 flex gap-8 border-b border-secondary/10 pb-8">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Assignee</span>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-[10px] font-bold text-secondary-foreground">
                      {issue.assignee ? issue.assignee.charAt(0) : "U"}
                    </span>
                    <select
                      className="bg-transparent text-xs font-medium text-foreground outline-none border-none cursor-pointer appearance-none p-0 pr-4"
                      value={issue.assignee || ""}
                      onChange={(e) => handleAssigneeChange(e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      <option value="Sarah Jenkins">Sarah Jenkins</option>
                      <option value="System">System</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Priority</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined shrink-0 text-[16px] text-muted-foreground">
                      {issue.priority === "High" || issue.priority === "Critical" ? "keyboard_double_arrow_up" :
                       issue.priority === "Medium" ? "drag_handle" : "keyboard_double_arrow_down"}
                    </span>
                    <select
                      className="bg-transparent text-xs font-medium text-foreground outline-none border-none cursor-pointer appearance-none p-0 pr-4"
                      value={issue.priority}
                      onChange={(e) => handlePriorityChange(e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              {issue.description && (
                <div className="mb-8 border-b border-secondary/10 pb-6">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Description</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {issue.description}
                  </p>
                </div>
              )}

              {/* Activity Feed */}
              <div className="flex-1 overflow-y-auto pr-4">
                <div className="relative pl-6">
                  {/* Timeline Line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-secondary/20" />

                  {issue.activityFeed.map((event) => (
                    <div key={event.id} className="relative mb-8">
                      <div className={`absolute -left-[30px] top-0 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-[#ffffff] ${event.type === 'Agent' ? 'bg-primary/10' : 'bg-[#f7f9fb]'}`}>
                        <span className={`material-symbols-outlined text-[14px] ${event.type === 'Agent' ? 'text-primary' : 'text-muted-foreground'}`}>
                          {event.type === 'Agent' ? 'robot_2' : 'person'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${event.type === 'Agent' ? 'text-primary' : 'text-foreground'}`}>
                            {event.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </span>
                        </div>
                        <div className={event.type === 'Agent' ? "rounded-lg bg-surface-container-low p-4 text-sm leading-relaxed text-foreground" : "text-sm leading-relaxed text-muted-foreground"}>
                          {event.message}
                          {event.metadata && (
                            <div className="mt-2 text-xs opacity-60">
                              Confidence: {event.metadata.confidenceScore}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48">
              <span className="text-destructive text-sm">Issue not found.</span>
            </div>
          )}

          {/* Action Bar */}
          <div className="mt-8 pt-6">
            <div className="flex w-full items-center gap-3">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handlePostComment(); }}
                placeholder="Reply to ticket..."
                disabled={posting || !issue}
                className="h-11 flex-1 rounded-md border border-outline-variant/15 bg-[#f7f9fb] px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
              />
              <Button 
                onClick={handlePostComment}
                disabled={posting || !issue || !commentText.trim()}
                className="bg-primary-gradient h-11 px-6 text-white shadow-lg shadow-primary/20 hover:opacity-90 border-none"
              >
                {posting ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
