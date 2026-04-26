import { apiClient } from "./api-client";

export interface SettingsPreferences {
  compactQueueDensity: boolean;
  showAiConfidenceScores: boolean;
}

export interface Settings {
  fullName: string;
  email: string;
  preferences: SettingsPreferences;
}

export interface SettingsResponse {
  data: Settings;
}

export class SettingsService {
  /**
   * Retrieves the settings for the currently authenticated IT Specialist.
   */
  static async getSettings(): Promise<SettingsResponse> {
    return apiClient.get<SettingsResponse>("/settings/me");
  }

  /**
   * Updates the settings/preferences for the currently authenticated IT Specialist.
   */
  static async updateSettings(payload: { preferences: Partial<SettingsPreferences> }): Promise<SettingsResponse> {
    return apiClient.patch<SettingsResponse>("/settings/me", payload);
  }
}
