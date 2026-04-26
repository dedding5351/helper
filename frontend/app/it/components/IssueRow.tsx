import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export type Issue = {
  id: string;
  title: string;
  status: "Open" | "In Progress" | "Resolved" | "Auto-Escalated" | "Blocked";
  priority: "High" | "Medium" | "Low";
  assignee?: string;
  time: string;
};

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

function getStatusBadge(status: Issue["status"]) {
  if (status === "Auto-Escalated") {
    return (
      <Badge
        variant="secondary"
        className="rounded-full border-none bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary shadow-none"
      >
        Auto-Escalated
      </Badge>
    );
  }
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      {status === "Open" && <span className="inline-flex h-2 w-2 rounded-full bg-secondary" />}
      {status === "In Progress" && <span className="inline-flex h-2 w-2 rounded-full bg-[#8C6C94]" />}
      {status === "Blocked" && <span className="inline-flex h-2 w-2 rounded-full bg-destructive/50" />}
      {status === "Resolved" && <span className="inline-flex h-2 w-2 rounded-full bg-primary" />}
      {status}
    </div>
  );
}

export function IssueRow({ issue }: { issue: Issue }) {
  return (
    <Link
      href={`/it?issue=${issue.id}`}
      className="group flex items-center justify-between gap-4 px-8 py-3 transition-colors hover:bg-[#f0f4f7]"
    >
      <div className="flex flex-1 items-center gap-4">
        <div className="flex w-6 justify-center">
          {getPriorityIcon(issue.priority)}
        </div>
        <div className="w-16 text-xs font-medium text-muted-foreground">
          {issue.id}
        </div>
        <div className="flex-1 text-sm font-semibold tracking-tight text-foreground group-hover:text-primary">
          {issue.title}
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="w-32">
          {getStatusBadge(issue.status)}
        </div>
        <div className="flex w-32 items-center gap-2">
          {issue.assignee ? (
            <>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/20 text-[10px] font-bold text-secondary-foreground">
                {issue.assignee.charAt(0)}
              </div>
              <span className="text-xs font-medium text-muted-foreground">{issue.assignee}</span>
            </>
          ) : (
            <span className="text-xs font-medium text-muted-foreground/50 border border-dashed border-muted-foreground/30 px-2 py-0.5 rounded-full">Unassigned</span>
          )}
        </div>
        <div className="w-16 text-right text-xs text-muted-foreground">
          {issue.time}
        </div>
      </div>
    </Link>
  );
}
