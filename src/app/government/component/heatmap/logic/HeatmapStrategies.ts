import { HeatmapArea } from "../../../hooks/useDashboard";

/**
 * [STRATEGY PATTERN] - MAP_RISK_STRATEGY: GIS-specific visual logic.
 */
export const MAP_RISK_STRATEGY: Record<HeatmapArea["risk"], { color: string; radius: number }> = {
  low: { color: "#10b981", radius: 1.5 },
  medium: { color: "#f59e0b", radius: 2.5 },
  high: { color: "#ef4444", radius: 3.5 },
};

/**
 * [STRATEGY PATTERN] - UI_RISK_STRATEGY: Dashboard-specific visual logic.
 */
export const UI_RISK_STRATEGY: Record<HeatmapArea["risk"], string> = {
  low: "bg-(--color-success-bg) text-(--color-success)",
  medium: "bg-(--color-warning-bg) text-(--color-warning)",
  high: "bg-(--color-danger-bg) text-(--color-danger)",
};
