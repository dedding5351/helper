import { apiClient } from "./api-client";

export type RunbookStatus = "Active" | "Deprecated";

export interface Runbook {
  id: string;
  title: string;
  author: string;
  tags: string[];
  status: RunbookStatus;
  description?: string;
  sourceFilename?: string;
}

export interface KnowledgeDocument {
  id: string;
  runbookId: string;
  filename: string;
  contentType: string;
  chunkCount: number;
  status: string;
  createdAt: string;
}

export interface UploadResponse {
  runbook: Runbook;
  document: KnowledgeDocument;
  chunksProcessed: number;
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

  /**
   * Uploads a document, auto-creates a runbook, and ingests it into ChromaDB.
   */
  static async uploadDocument(file: File, title?: string, tags?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (title) formData.append("title", title);
    if (tags) formData.append("tags", tags);

    return apiClient.postFormData<UploadResponse>("/runbooks/upload", formData);
  }

  /**
   * Retrieves all documents for a specific runbook.
   */
  static async getDocuments(runbookId: string): Promise<{ data: KnowledgeDocument[] }> {
    return apiClient.get<{ data: KnowledgeDocument[] }>(`/runbooks/${runbookId}/documents`);
  }

  /**
   * Deletes a document and its embeddings.
   */
  static async deleteDocument(runbookId: string, docId: string): Promise<void> {
    return apiClient.delete(`/runbooks/${runbookId}/documents/${docId}`);
  }

  /**
   * Searches the knowledge base across all runbooks.
   */
  static async searchKnowledge(query: string): Promise<any[]> {
    return apiClient.get<any[]>(`/runbooks/search?q=${encodeURIComponent(query)}`);
  }
}
