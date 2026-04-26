"use client";

import * as React from "react";
import { IssueService } from "../services/issue.service";
import { Button } from "@/components/ui/button";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTicketModal({ isOpen, onClose, onSuccess }: CreateTicketModalProps) {
  const [title, setTitle] = React.useState("");
  const [priority, setPriority] = React.useState("Medium");
  const [assignee, setAssignee] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await IssueService.createIssue({
        title,
        priority,
        assignee: assignee || null,
        description: description || undefined,
      });
      setTitle("");
      setPriority("Medium");
      setAssignee("");
      setDescription("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create ticket", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-card p-8 shadow-[0_20px_60px_rgba(44,52,55,0.12)] border border-outline-variant/20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Create New Ticket</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Printer broken on 3rd floor"
              required
              className="h-11 w-full rounded-md border border-outline-variant/15 bg-white px-4 text-sm text-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-11 w-full rounded-md border border-outline-variant/15 bg-white px-4 text-sm text-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Assignee</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="h-11 w-full rounded-md border border-outline-variant/15 bg-white px-4 text-sm text-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option value="">Unassigned</option>
                <option value="Sarah Jenkins">Sarah Jenkins</option>
                <option value="System">System</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about the issue..."
              rows={4}
              className="w-full resize-none rounded-md border border-outline-variant/15 bg-white p-4 text-sm text-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
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
              {loading ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
