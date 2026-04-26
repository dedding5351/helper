"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  IssueService,
  IssueDetails,
} from "@/app/it/services/issue.service";

const STATUS_META: Record<
  string,
  { label: string; tone: "neutral" | "primary" | "success" | "warning" }
> = {
  Open: { label: "Awaiting Triage", tone: "neutral" },
  "Auto-Escalated": { label: "Routed to IT Specialist", tone: "warning" },
  "In Progress": { label: "Being Investigated", tone: "primary" },
  Blocked: { label: "Blocked", tone: "warning" },
  Resolved: { label: "Resolved", tone: "success" },
};

const PROGRESS_STEPS: Array<{ key: string; label: string }> = [
  { key: "Submitted", label: "Submitted" },
  { key: "Auto-Escalated", label: "Routed to IT" },
  { key: "In Progress", label: "In Progress" },
  { key: "Resolved", label: "Resolved" },
];

function getStepIndex(status: string): number {
  switch (status) {
    case "Open":
      return 0;
    case "Auto-Escalated":
      return 1;
    case "In Progress":
      return 2;
    case "Blocked":
      return 2;
    case "Resolved":
      return 3;
    default:
      return 0;
  }
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, tone: "neutral" };
  const toneClass =
    meta.tone === "primary"
      ? "bg-primary/10 text-primary"
      : meta.tone === "success"
        ? "bg-emerald-500/10 text-emerald-700"
        : meta.tone === "warning"
          ? "bg-amber-500/10 text-amber-700"
          : "bg-secondary/10 text-secondary-foreground";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${toneClass}`}
    >
      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}

function ProgressTimeline({ status }: { status: string }) {
  const activeIdx = getStepIndex(status);
  return (
    <div className="flex items-center gap-2">
      {PROGRESS_STEPS.map((step, idx) => {
        const reached = idx <= activeIdx;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                  reached
                    ? "bg-primary text-white"
                    : "bg-secondary/20 text-muted-foreground"
                }`}
              >
                {reached ? (
                  <span className="material-symbols-outlined text-[14px]">
                    check
                  </span>
                ) : (
                  idx + 1
                )}
              </span>
              <span
                className={`whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest ${
                  reached ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < PROGRESS_STEPS.length - 1 && (
              <div
                className={`h-px flex-1 ${
                  idx < activeIdx ? "bg-primary" : "bg-secondary/20"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function UserTicketDetailModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const issueId = searchParams.get("issue");

  const [issue, setIssue] = React.useState<IssueDetails | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const [posting, setPosting] = React.useState(false);

  const close = React.useCallback(() => {
    router.push("/user/tickets");
  }, [router]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && issueId) close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [issueId, close]);

  React.useEffect(() => {
    if (!issueId) {
      setIssue(null);
      return;
    }
    setLoading(true);
    IssueService.getIssueById(issueId)
      .then((res) => setIssue(res.data))
      .catch((err) => console.error("Failed to load ticket details", err))
      .finally(() => setLoading(false));
  }, [issueId]);

  const handlePostComment = async () => {
    if (!issueId || !commentText.trim() || !issue) return;
    setPosting(true);
    try {
      const event = await IssueService.addIssueComment(issueId, commentText);
      setIssue({
        ...issue,
        activityFeed: [...issue.activityFeed, event],
      });
      setCommentText("");
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setPosting(false);
    }
  };

  if (!issueId) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[#f7f9fb]/40 backdrop-blur-[2px]"
        onClick={close}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl transform bg-[#ffffff]/90 p-8 shadow-[0_0_60px_rgba(44,52,55,0.08)] backdrop-blur-xl transition-transform duration-300 ease-in-out sm:p-12">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {issue?.id ?? issueId}
              </span>
              {issue && <StatusBadge status={issue.status} />}
            </div>
            <button
              onClick={close}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
              title="Close (Esc)"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          </div>

          {loading || !issue ? (
            <div className="flex items-center justify-center h-48">
              <span className="text-muted-foreground text-sm">
                {loading ? "Loading ticket..." : "Ticket not found."}
              </span>
            </div>
          ) : (
            <>
              <h2
                className="mb-6 text-3xl font-bold tracking-tight text-foreground"
                style={{ letterSpacing: "-0.02em" }}
              >
                {issue.title}
              </h2>

              <div className="mb-8 rounded-xl bg-[#f7f9fb] p-5">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Progress
                </div>
                <ProgressTimeline status={issue.status} />
              </div>

              <div className="mb-8 border-b border-secondary/10 pb-8">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Assigned To
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-[10px] font-bold text-secondary-foreground">
                      {issue.assignee ? issue.assignee.charAt(0) : "—"}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {issue.assignee ?? "Awaiting assignment"}
                    </span>
                  </div>
                </div>
              </div>

              {issue.description && (
                <div className="mb-8 border-b border-secondary/10 pb-6">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Your Request
                  </h4>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                    {issue.description}
                  </p>
                </div>
              )}

              <div className="flex-1 overflow-y-auto pr-4">
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Activity
                </h4>
                <div className="relative pl-6">
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-secondary/20" />
                  {issue.activityFeed.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No activity yet.
                    </div>
                  ) : (
                    issue.activityFeed.map((event) => (
                      <div key={event.id} className="relative mb-8">
                        <div
                          className={`absolute -left-[30px] top-0 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-[#ffffff] ${
                            event.type === "Agent"
                              ? "bg-primary/10"
                              : "bg-[#f7f9fb]"
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-[14px] ${
                              event.type === "Agent"
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {event.type === "Agent" ? "robot_2" : "person"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold ${
                                event.type === "Agent"
                                  ? "text-primary"
                                  : "text-foreground"
                              }`}
                            >
                              {event.author}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.timestamp).toLocaleString(
                                undefined,
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </span>
                          </div>
                          <div
                            className={
                              event.type === "Agent"
                                ? "rounded-lg bg-surface-container-low p-4 text-sm leading-relaxed text-foreground"
                                : "text-sm leading-relaxed text-muted-foreground"
                            }
                          >
                            {event.message}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6">
                <div className="flex w-full items-center gap-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePostComment();
                    }}
                    placeholder="Add a reply or follow-up..."
                    disabled={posting}
                    className="h-11 flex-1 rounded-md border border-outline-variant/15 bg-[#f7f9fb] px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
                  />
                  <Button
                    onClick={handlePostComment}
                    disabled={posting || !commentText.trim()}
                    className="bg-primary-gradient h-11 px-6 text-white shadow-lg shadow-primary/20 hover:opacity-90 border-none"
                  >
                    {posting ? "Sending..." : "Send"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
