import { ScenarioType, ScenarioStatus } from "../../../../context/services/mock/government/scenario-management";
import { Flame, Droplets, Wind, Zap, AlertCircle } from "lucide-react";

/**
 * [STRATEGY PATTERN] - ScenarioTypeStrategy: Decouples icons and colors from scenario types.
 */
export const SCENARIO_TYPE_STRATEGY: Record<ScenarioType, { icon: any; color: string; bgColor: string }> = {
  flood: { icon: Droplets, color: "text-blue-500", bgColor: "bg-blue-50" },
  storm: { icon: Wind, color: "text-indigo-500", bgColor: "bg-indigo-50" },
  fire: { icon: Flame, color: "text-orange-500", bgColor: "bg-orange-50" },
  earthquake: { icon: Zap, color: "text-amber-500", bgColor: "bg-amber-50" },
};

/**
 * [STRATEGY PATTERN] - ScenarioStatusStrategy: Decouples status styling.
 */
export const SCENARIO_STATUS_STRATEGY: Record<ScenarioStatus, string> = {
  active: "text-green-600 bg-green-50 border-green-200",
  draft: "text-gray-500 bg-gray-50 border-gray-200",
  archived: "text-slate-400 bg-slate-50 border-slate-100",
};
