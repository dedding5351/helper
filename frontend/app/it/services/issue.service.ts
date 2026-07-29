import { apiClient } from "./api-client";

export type IssueStatus = "Open" | "In Progress" | "Resolved" | "Auto-Escalated" | "Blocked";
export type IssuePriority = "High" | "Medium" | "Low" | "Critical";

export interface ActivityEvent {
  id: string;
  type: "User" | "Agent" | "System";
  author: string;
  timestamp: string;
  message: string;
  metadata?: any;
}

export interface Issue {
  id: string;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee?: string;
  requester?: string;
  description?: string;
  createdAt: string;
}

export interface IssueDetails extends Issue {
  activityFeed: ActivityEvent[];
}

export interface IssueFilters {
  status?: string;
  assignee?: string;
  requester?: string;
  limit?: number;
  offset?: number;
}

export interface IssuesResponse {
  data: Issue[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export class IssueService {
  /**
   * Retrieves a list of issues based on optional filters.
   */
  static async getIssues(filters?: IssueFilters): Promise<IssuesResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.assignee) params.append("assignee", filters.assignee);
    if (filters?.requester) params.append("requester", filters.requester);
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.offset) params.append("offset", filters.offset.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get<IssuesResponse>(`/issues${queryString}`);
  }

  /**
   * Retrieves detailed information for a specific issue.
   */
  static async getIssueById(id: string): Promise<{ data: IssueDetails }> {
    return apiClient.get<{ data: IssueDetails }>(`/issues/${id}`);
  }

  static async createIssue(data: { title: string; priority: string; assignee: string | null; description?: string; requester?: string | null; status?: IssueStatus }) {
    return apiClient.post<Issue>("/issues/", data);
  }

  /**
   * Updates the status of an issue.
   */
  static async updateIssueStatus(id: string, status: IssueStatus): Promise<Issue> {
    return apiClient.patch<Issue>(`/issues/${id}/status`, { status });
  }

  /**
   * Updates multiple fields of an issue.
   */
  static async updateIssue(id: string, data: Partial<Omit<Issue, "id" | "createdAt">>): Promise<Issue> {
    return apiClient.patch<Issue>(`/issues/${id}`, data);
  }

  static async bulkUpdateIssues(
    issueIds: string[],
    update: Partial<Omit<Issue, "id" | "createdAt">>
  ): Promise<{ updated: number; issues: Issue[] }> {
    return apiClient.patch("/issues/bulk", { issue_ids: issueIds, update });
  }

  /**
   * Adds a new comment/activity to an issue.
   */
  static async addIssueComment(id: string, message: string): Promise<ActivityEvent> {
    return apiClient.post<ActivityEvent>(`/issues/${id}/comments`, { message });
  }
}
