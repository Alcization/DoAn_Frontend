import { useCallback } from "react";
import { HeatmapArea } from "../../../context/services/mock/government/dashboard";
import { RISK_STYLE_STRATEGY } from "../component/modal-logic/ModalStrategies";

/**
 * [FACADE PATTERN] - useResponseRoute: Logic for response route planning.
 */
export function useResponseRoute(area: HeatmapArea | null) {
  const getRiskStyle = useCallback(() => {
    if (!area) return "";
    return RISK_STYLE_STRATEGY[area.risk as keyof typeof RISK_STYLE_STRATEGY] || "";
  }, [area]);

  return {
    getRiskStyle
  };
}
