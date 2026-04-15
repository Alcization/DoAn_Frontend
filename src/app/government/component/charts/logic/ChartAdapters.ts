import {
  PIE_CHART_DATA,
  LINE_CHART_POINTS,
} from "../../../../../context/services/mock/government/dashboard";
import { IChartDataPoint } from "./ChartTypes";

interface PieChartSlice {
  labelKey: string;
  value: number;
  color: string;
}

/**
 * [ADAPTER PATTERN] - Adapters to transform various data sources into a unified IChartData format.
 * Follows: Single Responsibility Principle (SRP).
 */
export class BarChartDataAdapter {
  static adapt(heatmapData: any[]): IChartDataPoint[] {
    return heatmapData.map((area) => ({
      label: area.name,
      value: area.alerts,
      color: area.risk === "high" ? "var(--color-danger)" : area.risk === "medium" ? "var(--color-warning)" : "var(--color-success)",
    }));
  }
}

export class PieChartDataAdapter {
  static adapt(): IChartDataPoint[] {
    return (PIE_CHART_DATA as PieChartSlice[]).map(slice => ({
      label: slice.labelKey,
      value: slice.value,
      color: slice.color
    }));
  }
}

export class LineChartDataAdapter {
  static adapt(): IChartDataPoint[] {
    return LINE_CHART_POINTS;
  }
}

/**
 * [FACTORY METHOD PATTERN] - Creates the appropriate data adapter based on chart type.
 */
export class ChartDataFactory {
  static getData(type: string, heatmapData: any[]): IChartDataPoint[] {
    switch (type) {
      case "bar": return BarChartDataAdapter.adapt(heatmapData);
      case "pie": return PieChartDataAdapter.adapt();
      case "line": return LineChartDataAdapter.adapt();
      default: return [];
    }
  }
}
