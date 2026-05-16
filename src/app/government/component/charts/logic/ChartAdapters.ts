import { LINE_CHART_POINTS } from "../../../../../context/services/mock/government/dashboard";
import { IChartDataPoint } from "./ChartTypes";

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
  static adapt(heatmapData: any[]): IChartDataPoint[] {
    const total = heatmapData.reduce((sum, area) => sum + (area.alerts || 0), 0);
    const riskBuckets = heatmapData.reduce<Record<"low" | "medium" | "high", number>>(
      (acc, area) => {
        const risk = area.risk as "low" | "medium" | "high";
        if (risk in acc) {
          acc[risk] += area.alerts || 0;
        }
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );

    const toPercent = (value: number) => {
      if (total === 0) return 0;
      return Math.round((value / total) * 100);
    };

    return [
      {
        label: "dashboard.map.risk.low",
        value: toPercent(riskBuckets.low),
        color: "var(--color-success)",
      },
      {
        label: "dashboard.map.risk.medium",
        value: toPercent(riskBuckets.medium),
        color: "var(--color-warning)",
      },
      {
        label: "dashboard.map.risk.high",
        value: toPercent(riskBuckets.high),
        color: "var(--color-danger)",
      },
    ];
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
      case "pie": return PieChartDataAdapter.adapt(heatmapData);
      case "line": return LineChartDataAdapter.adapt();
      default: return [];
    }
  }
}
