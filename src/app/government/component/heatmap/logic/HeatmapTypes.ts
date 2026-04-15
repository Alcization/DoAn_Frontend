import { LucideIcon } from "lucide-react";
import { HeatmapArea } from "../../../hooks/useDashboard";

export interface DetailItem {
  label: string;
  value: string | number;
  Icon: LucideIcon;
}

export type RiskLevel = HeatmapArea["risk"];
