import { Frequency, ReportConfig } from "./ReportTypes";

/**
 * [STRATEGY PATTERN] - FREQUENCY_STRATEGY: Logic for different report frequencies.
 */
export const FREQUENCY_STRATEGY = {
  weekly: {
    getDays: (t: any) => [
      { value: "2", label: t("reports.config.days.2") },
      { value: "3", label: t("reports.config.days.3") },
      { value: "4", label: t("reports.config.days.4") },
      { value: "5", label: t("reports.config.days.5") },
      { value: "6", label: t("reports.config.days.6") },
      { value: "7", label: t("reports.config.days.7") },
      { value: "8", label: t("reports.config.days.8") },
    ],
  },
  monthly: {
    getDays: () => Array.from({ length: 31 }, (_, i) => ({
      value: String(i + 1),
      label: String(i + 1),
    })),
  },
};

/**
 * [STRATEGY PATTERN] - STATUS_STYLE_STRATEGY: Styling for report history status.
 */
export const STATUS_STYLE_STRATEGY = {
  sent: "bg-(--color-success-bg) !text-(--color-success)",
  failed: "bg-(--color-danger-bg) !text-(--color-danger)",
  pending: "bg-(--color-warning-bg) !text-(--color-warning)",
};
