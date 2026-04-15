import {
  Droplets,
  Layers3,
  Thermometer,
  Wind,
} from "lucide-react";
import { HeatmapArea } from "../../../hooks/useDashboard";
import { DetailItem } from "./HeatmapTypes";

/**
 * [FACTORY METHOD PATTERN] - HeatmapDetailFactory: Standardizes creation of detail fields.
 */
export class HeatmapDetailFactory {
  static create(t: any, area: HeatmapArea): DetailItem[] {
    return [
      {
        label: t("dashboard.map.details.activeAlerts"),
        value: area.alerts,
        Icon: Layers3,
      },
      {
        label: t("dashboard.map.details.rainfall"),
        value: `${area.rainfall} mm`,
        Icon: Droplets,
      },
      {
        label: t("dashboard.map.details.windSpeed"),
        value: `${area.wind} km/h`,
        Icon: Wind,
      },
      {
        label: t("dashboard.map.details.avgTemp"),
        value: `${Math.round(area.temp || 0)}°C`,
        Icon: Thermometer,
      },
    ];
  }
}
