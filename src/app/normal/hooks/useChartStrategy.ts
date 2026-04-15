import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/**
 * ChartDataPoint defines a single entry in a chart's dataset.
 */
export interface ChartDataPoint {
  label: string;
  [key: string]: any;
}

/**
 * ChartStrategy (Strategy Pattern)
 * 
 * Defines the interface for different data processing strategies.
 */
export interface ChartStrategy {
  getData(timeRange: string): ChartDataPoint[];
}

/**
 * useChartStrategy hook
 * 
 * Provides different data strategies for charts.
 * This decouples the data generation/fetching from the UI components.
 */
export const useChartStrategy = (timeRange: string) => {
  const { t } = useTranslation();

  /**
   * Seeded pseudo-random for deterministic mock data.
   */
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  /**
   * WeatherTrendStrategy (Implementation of ChartStrategy)
   */
  const trendStrategy = useMemo((): ChartStrategy => ({
    getData: (range: string) => {
      if (range === "24h") {
        return Array.from({ length: 24 }, (_, i) => ({
          label: `${i.toString().padStart(2, "0")}:00`,
          temp: 25 + Math.sin((i / 24) * Math.PI * 2 - 1) * 5 + seededRandom(i + 100) * 1.5,
          rain: Math.max(0, 10 + Math.sin(((i - 4) / 24) * Math.PI * 2) * 10 + seededRandom(i + 200) * 2),
          wind: 14 + Math.sin(((i + 6) / 24) * Math.PI * 2) * 5 + seededRandom(i + 300) * 1.5,
        }));
      } else {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return days.map((day, i) => ({
          label: t(`common.days.${day}`),
          temp: 27 + Math.sin((i / 7) * Math.PI * 2) * 3 + seededRandom(i + 10) * 1,
          rain: Math.max(2, 12 + Math.sin(((i - 1) / 7) * Math.PI * 2) * 10 + seededRandom(i + 20) * 2),
          wind: 15 + Math.sin(((i + 2) / 7) * Math.PI * 2) * 4 + seededRandom(i + 30) * 1.5,
        }));
      }
    }
  }), [t]);

  /**
   * Memorized data based on current strategy and timeRange.
   */
  const chartData = useMemo(() => trendStrategy.getData(timeRange), [trendStrategy, timeRange]);

  return {
    chartData,
  };
};
