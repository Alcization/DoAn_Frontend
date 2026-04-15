import { useTranslation } from "react-i18next";
import { BarChart3, LineChart, PieChart } from "lucide-react";
import { ChartDataFactory } from "./charts/logic/ChartAdapters";
import { ChartWidget } from "./charts/ChartWidget";
import { BarChartStrategy } from "./charts/BarChartStrategy";
import { PieChartStrategy } from "./charts/PieChartStrategy";
import { LineChartStrategy } from "./charts/LineChartStrategy";

/**
 * [FINAL INTEGRATION / COMPOSITE PATTERN]
 * ChartsView acts as a Composite container for individual ChartWidgets.
 * Follows: Interface Segregation (ISP) and Open/Closed Principle (OCP).
 */
export default function ChartsView({ totalAlerts, heatmapData }: { totalAlerts: number; heatmapData: any[] }) {
  const { t } = useTranslation();

  // Data Procurement using Factory & Adapters
  const barData = ChartDataFactory.getData("bar", heatmapData);
  const pieData = ChartDataFactory.getData("pie", heatmapData);
  const lineData = ChartDataFactory.getData("line", heatmapData);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ChartWidget title={t("dashboard.chart.alertsByRegion")} Icon={BarChart3} cols="lg:col-span-2">
        <BarChartStrategy data={barData} />
      </ChartWidget>

      <ChartWidget title={t("dashboard.chart.alertDistribution")} Icon={PieChart}>
        <PieChartStrategy data={pieData} totalAlerts={totalAlerts} />
      </ChartWidget>

      <ChartWidget title={t("dashboard.chart.weatherTrend")} Icon={LineChart} cols="lg:col-span-3">
        <LineChartStrategy data={lineData} />
      </ChartWidget>
    </section>
  );
}
