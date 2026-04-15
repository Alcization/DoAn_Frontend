import { useState, useCallback, useRef } from "react";
import { apiClient } from "@/services/api-config";

/**
 * ReportSettingsState defines the structure of user-adjustable report configurations.
 */
export interface ReportSettingsState {
  scheduleType: "weekly" | "monthly";
  weeklyDay: string;
  monthlyDay: string;
  content: string[];
  formats: string[];
}

interface CurrentUserResponse {
  email?: string;
}

interface ReportSchedule {
  id: number;
  type: "weekly" | "monthly";
  day: number;
  name: string | null;
  email: string;
}

import { INITIAL_REPORT_SETTINGS } from "@/context/services/mock/normal/business/reports";

/**
 * useReportSettings hook (State & Memento Patterns)
 * 
 * Manages the multi-faceted state of report configurations (State pattern).
 * Uses a ref-based 'memento' to store the last saved state, allowing 
 * for a simple 'reset' or 'undo' functionality (Memento pattern).
 */
export const useReportSettings = (initialSettings?: ReportSettingsState) => {
  const [settings, setSettings] = useState<ReportSettingsState>(initialSettings || INITIAL_REPORT_SETTINGS);

  /**
   * Memento: Stores a snapshot of the settings.
   */
  const memento = useRef<ReportSettingsState>(settings);

  /**
   * Updates settings state.
   */
  const updateSettings = useCallback((newSettings: Partial<ReportSettingsState>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const loadSavedSchedules = useCallback(async () => {
    const response = await apiClient.get<ReportSchedule[]>("/users/me/report-schedules");
    const schedules = response.data || [];

    if (!Array.isArray(schedules) || schedules.length === 0) {
      return false;
    }

    const businessSchedules = schedules.filter((item) => item.name === null);
    const sourceSchedules = businessSchedules.length > 0 ? businessSchedules : schedules;

    const weeklySchedule = sourceSchedules
      .filter((item) => item.type === "weekly")
      .sort((a, b) => b.id - a.id)[0];

    const monthlySchedule = sourceSchedules
      .filter((item) => item.type === "monthly")
      .sort((a, b) => b.id - a.id)[0];

    const latestSchedule = [...sourceSchedules].sort((a, b) => b.id - a.id)[0];

    let nextSettingsSnapshot: ReportSettingsState | null = null;

    setSettings((prev) => {
      const nextSettings: ReportSettingsState = {
        ...prev,
        scheduleType: latestSchedule?.type || prev.scheduleType,
        weeklyDay: weeklySchedule ? String(weeklySchedule.day) : prev.weeklyDay,
        monthlyDay: monthlySchedule ? String(monthlySchedule.day) : prev.monthlyDay,
      };

      nextSettingsSnapshot = nextSettings;
      return nextSettings;
    });

    if (nextSettingsSnapshot !== null) {
      memento.current = nextSettingsSnapshot;
    }

    return true;
  }, []);

  /**
   * Saves the current settings to the memento (and ideally an API).
   */
  const save = useCallback(async () => {
    const selectedDay = settings.scheduleType === "weekly"
      ? Number(settings.weeklyDay)
      : Number(settings.monthlyDay);

    const userResponse = await apiClient.get<CurrentUserResponse>("/users/me");
    const currentUserEmail = userResponse.data?.email;

    if (!currentUserEmail) {
      throw new Error("Không thể lấy email người dùng hiện tại.");
    }

    await apiClient.post("/users/me/report-schedules", {
      type: settings.scheduleType,
      day: selectedDay,
      name: null,
      email: currentUserEmail,
    });

    memento.current = { ...settings };

    return true;
  }, [settings]);

  /**
   * Resets settings to the last saved memento state.
   */
  const reset = useCallback(() => {
    setSettings({ ...memento.current });
  }, []);

  return {
    settings,
    updateSettings,
    loadSavedSchedules,
    save,
    reset,
  };
};
