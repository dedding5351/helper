"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { IssueService } from "@/app/it/services/issue.service";

const CURRENT_USER = "default-user";

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (issueId: string) => void;
}

export function CreateRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateRequestModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const issue = await IssueService.createIssue({
        title: title.trim(),
        priority: "Medium",
        assignee: null,
        requester: CURRENT_USER,
        description: description.trim() || undefined,
        status: "Auto-Escalated",
      });
      onSuccess(issue.id);
    } catch (err) {
      console.error("Failed to submit request", err);
      setError("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-card p-8 shadow-[0_20px_60px_rgba(44,52,55,0.12)]">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
              Manual Escalation
            </span>
            <h2
              className="mt-1 text-xl font-bold tracking-tight text-foreground"
              style={{ letterSpacing: "-0.02em" }}
            >
              Submit a New Request
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="mb-6 text-sm font-light leading-relaxed text-muted-foreground">
          This will route directly to an IT Specialist for review.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Subject
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need help with?"
              required
              className="h-11 w-full rounded-md border border-outline-variant/15 bg-white px-4 text-sm text-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any context that might help an IT Specialist..."
              rows={4}
              className="w-full resize-none rounded-md border border-outline-variant/15 bg-white p-4 text-sm text-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-destructive">{error}</p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="px-6 border-outline-variant/20 hover:bg-secondary/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="bg-primary-gradient border-none px-6 text-white shadow-lg shadow-primary/20 hover:opacity-90"
            >
              {loading ? "Submitting..." : "Escalate to IT"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
