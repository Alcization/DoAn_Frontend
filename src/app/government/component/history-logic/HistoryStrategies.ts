import { IncidentSeverity, IncidentStatus } from "../../../../context/services/mock/government/history-incidents";

export interface BadgeStyle {
  className: string;
}

/**
 * [STRATEGY PATTERN] - SEVERITY_STRATEGY: Styling strategies for different severity levels.
 */
export const SEVERITY_STRATEGY: Record<IncidentSeverity, BadgeStyle> = {
  High: {
    className: "!text-(--color-danger) bg-(--color-danger-bg)",
  },
  Medium: {
    className: "!text-(--color-warning) bg-(--color-warning-bg)",
  },
  Low: {
    className: "!text-(--color-success) bg-(--color-success-bg)",
  },
};

/**
 * [STRATEGY PATTERN] - STATUS_STRATEGY: Styling strategies for different incident statuses.
 */
export const STATUS_STRATEGY: Record<IncidentStatus, BadgeStyle> = {
  Handled: {
    className: "!text-(--color-success) bg-(--color-success-bg)",
  },
  Pending: {
    className: "!text-(--color-warning) bg-(--color-warning-bg)",
  },
};
