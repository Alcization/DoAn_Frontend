import { useTranslation } from "react-i18next";
import { AlertCircle, AlertTriangle, Droplets, Wind, LucideIcon } from "lucide-react";
import { HeatmapArea } from "../hooks/useDashboard";

type KPIStatsProps = {
  totalAlerts: number;
  areas: HeatmapArea[];
};

interface KPIDefinition {
  id: string;
  labelKey: string;
  icon: LucideIcon;
  colorClass: string;
  getValue: (params: { totalAlerts: number; areas: HeatmapArea[] }) => string | number;
}

/**
 * KPI_CONFIG: Open for extension, closed for modification.
 * Adding a new KPI only requires adding a new object to this array.
 */
const KPI_CONFIG: KPIDefinition[] = [
  {
    id: "total_alerts",
    labelKey: "dashboard.kpi.totalAlerts",
    icon: AlertTriangle,
    colorClass: "bg-(--color-danger-bg) text-(--color-danger)",
    getValue: ({ totalAlerts }) => totalAlerts,
  },
  {
    id: "high_risk",
    labelKey: "dashboard.kpi.highRiskAreas",
    icon: AlertCircle,
    colorClass: "bg-(--color-warning-bg) text-(--color-warning)",
    getValue: ({ areas }) => areas.filter((a) => a.risk === "high").length,
  },
  {
    id: "rainfall",
    labelKey: "dashboard.kpi.avgRainfall",
    icon: Droplets,
    colorClass: "bg-(--color-info-bg) text-(--color-info)",
    getValue: ({ areas }) => {
      if (areas.length === 0) return "0 mm";
      const avg = areas.reduce((sum, area) => sum + area.rainfall, 0) / areas.length;
      return `${Math.round(avg)} mm`;
    },
  },
  {
    id: "wind",
    labelKey: "dashboard.kpi.maxWind",
    icon: Wind,
    colorClass: "bg-(--color-success-bg) text-(--color-success)",
    getValue: ({ areas }) => {
      if (areas.length === 0) return "0 km/h";
      const maxWind = Math.max(...areas.map((area) => area.wind));
      return `${Math.round(maxWind)} km/h`;
    },
  },
];

export default function KPIStats({ totalAlerts, areas }: KPIStatsProps) {
  const { t } = useTranslation();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {KPI_CONFIG.map((kpi) => (
        <div
          key={kpi.id}
          className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div
            className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1 text-xs font-semibold ${kpi.colorClass}`}
          >
            <kpi.icon size={14} />
            {t(kpi.labelKey)}
          </div>
          <p className="text-3xl font-bold text-(--color-text-primary) mt-4 mb-1">
            {kpi.getValue({ totalAlerts, areas })}
          </p>
        </div>
      ))}
    </section>
  );
}
