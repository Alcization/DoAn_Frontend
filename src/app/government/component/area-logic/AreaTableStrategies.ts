import { ManagedArea } from "./AreaTableTypes";

/**
 * [STRATEGY PATTERN] - HotspotDotStrategy: Decouples hotspot values from CSS classes.
 */
export const getHotspotDotClass = (hotspotCount: number): string => {
  if (hotspotCount >= 10) return "bg-(--color-danger)";
  if (hotspotCount >= 4) return "bg-(--color-warning)";
  return "bg-(--color-success)";
};

/**
 * [STRATEGY PATTERN] - StatusStrategy: Decouples status values from CSS classes.
 */
export const STATUS_STRATEGY: Record<ManagedArea["status"], string> = {
  active: "bg-(--color-success-bg) text-(--color-success)",
  inactive: "bg-(--color-text-muted)/10 text-(--color-text-muted)",
};

/**
 * [STRATEGY PATTERN] - TypeStrategy: Decouples area types from CSS classes or labels.
 */
export const TYPE_STRATEGY = "inline-flex px-3 py-1 rounded-full text-(--text-xs) font-semibold bg-(--color-bg-secondary) text-(--color-text-secondary)";
