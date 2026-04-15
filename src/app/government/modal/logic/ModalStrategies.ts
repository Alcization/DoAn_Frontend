import type { Priority } from "../../../../context/services/mock/government/scenario-management";

/**
 * [STRATEGY PATTERN] - PRIORITY_STRATEGY: Define colors/styles for different priorities.
 */
export const PRIORITY_STRATEGY: Record<Priority, string> = {
  High: "text-(--color-danger) bg-(--color-danger-bg)",
  Medium: "text-(--color-warning) bg-(--color-warning-bg)",
  Low: "text-(--color-success) bg-(--color-success-bg)",
};

/**
 * [STRATEGY PATTERN] - ACTION_STYLE_STRATEGY: Styling for modal buttons based on action type.
 */
export const ACTION_STYLE_STRATEGY = {
    confirm: "bg-(--color-primary) shadow-(--color-primary)/20",
    danger: "bg-(--color-danger) shadow-(--color-danger)/20",
    success: "bg-(--color-success) shadow-(--color-success)/20",
    cancel: "border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) hover:bg-(--color-bg-secondary)"
};

/**
 * [STRATEGY PATTERN] - RISK_STYLE_STRATEGY: Styling for risk levels.
 */
export const RISK_STYLE_STRATEGY = {
    high: "bg-(--color-danger-bg) border-(--color-danger)/20 text-(--color-danger)",
    medium: "bg-(--color-warning-bg) border-(--color-warning)/20 text-(--color-warning)",
    low: "bg-(--color-success-bg) border-(--color-success)/20 text-(--color-success)"
};
