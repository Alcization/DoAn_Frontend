import { DashboardFilters } from "../hooks/useDashboard";

/**
 * DashboardService: Contains business logic for data transformation and filtering.
 * Adheres to SRP by separating data processing from React state management.
 */
export class DashboardService {
  static getTimeframeStart(timeframe: DashboardFilters["timeframe"]): Date | null {
    const now = new Date();

    switch (timeframe) {
      case "24h": {
        const start = new Date(now);
        start.setHours(now.getHours() - 24);
        return start;
      }
      case "7days": {
        const start = new Date(now);
        start.setDate(now.getDate() - 7);
        return start;
      }
      case "30days": {
        const start = new Date(now);
        start.setDate(now.getDate() - 30);
        return start;
      }
      default:
        return null;
    }
  }

  /**
   * Filters heatmap data based on the provided region.
   */
  static filterHeatmapData(originalData: any[], filters: DashboardFilters): any[] {
    return originalData.filter((area) => {
      const matchesRegion = filters.region === "all" || String(area.id) === filters.region;
      return matchesRegion;
    });
  }

  /**
   * Calculates the total number of alerts across all filtered areas.
   */
  static calculateTotalAlerts(filteredData: any[]): number {
    return filteredData.reduce((sum, area) => sum + area.alerts, 0);
  }
}
