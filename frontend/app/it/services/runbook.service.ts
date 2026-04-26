import { apiClient } from "./api-client";

export type RunbookStatus = "Active" | "Deprecated";

export interface Runbook {
  id: string;
  title: string;
  author: string;
  tags: string[];
  status: RunbookStatus;
}

export interface RunbooksResponse {
  data: Runbook[];
}

export class RunbookService {
  /**
   * Retrieves a list of all available runbooks.
   */
  static async getRunbooks(status?: RunbookStatus): Promise<RunbooksResponse> {
    const params = new URLSearchParams();
    if (status) {
      params.append("status", status);
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get<RunbooksResponse>(`/runbooks${queryString}`);
  }
}
