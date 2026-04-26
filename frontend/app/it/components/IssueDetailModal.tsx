"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function IssueDetailModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const issueId = searchParams.get("issue");

  // Keyboard shortcut to close (Escape)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && issueId) {
        router.push("/it");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [issueId, router]);

  if (!issueId) return null;

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
            <div className="flex items-center gap-4">
              <Badge
                variant="secondary"
                className="rounded-full border-none bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary shadow-none"
              >
                Auto-Escalated
              </Badge>
              <span className="text-sm font-medium text-muted-foreground">{issueId}</span>
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
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Network timeout fixed but service degraded
          </h2>

          <div className="mb-8 flex items-center gap-6 border-b border-secondary/10 pb-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Assignee</span>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-xs font-bold text-secondary-foreground">
                  S
                </div>
                <span className="text-sm font-medium text-foreground">Sarah Jenkins</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Priority</span>
              <div className="flex items-center gap-1.5">
                 <span className="material-symbols-outlined text-[16px] text-[#8C6C94]">stat_3</span>
                 <span className="text-sm font-medium text-foreground">High</span>
              </div>
            </div>
             <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Source</span>
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                 <span className="material-symbols-outlined text-[16px]">robot_2</span>
                 AI Agent
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="flex-1 overflow-y-auto pr-4">
            <div className="relative pl-6">
              {/* Timeline Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-secondary/20" />

              {/* Event 1 */}
              <div className="relative mb-8">
                <div className="absolute -left-[30px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#f7f9fb] ring-4 ring-[#ffffff]">
                   <span className="material-symbols-outlined text-[14px] text-muted-foreground">person</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">User Endpoint</span>
                    <span className="text-xs text-muted-foreground">2:14 PM</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    I'm getting a 504 Gateway Timeout when trying to access the staging database via the internal tool. It was working 10 minutes ago.
                  </p>
                </div>
              </div>

              {/* Event 2 - AI Agent */}
              <div className="relative mb-8">
                <div className="absolute -left-[30px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 ring-4 ring-[#ffffff]">
                   <span className="material-symbols-outlined text-[14px] text-primary">robot_2</span>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">Archive Agent</span>
                    <span className="text-xs text-muted-foreground">2:15 PM</span>
                  </div>
                  <div className="rounded-lg bg-surface-container-low p-4 text-sm leading-relaxed text-foreground">
                    I detected a network configuration drift on the staging VPC. I have automatically applied the remediation runbook `net-restore-04` which reset the NAT gateway. 
                    <br/><br/>
                    **Status:** The timeout is fixed, but latency remains elevated at 450ms. I am auto-escalating to an IT Specialist for manual review of the VPC flow logs.
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-8 pt-6">
            <div className="flex w-full items-center gap-3">
              <input
                type="text"
                placeholder="Reply to ticket..."
                className="h-11 flex-1 rounded-md border border-outline-variant/15 bg-[#f7f9fb] px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
              <Button className="bg-primary-gradient h-11 px-6 text-white shadow-lg shadow-primary/20 hover:opacity-90 border-none">
                Send
              </Button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
