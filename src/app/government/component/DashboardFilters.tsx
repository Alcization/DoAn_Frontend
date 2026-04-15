import { useTranslation } from "react-i18next";
import { ChevronDown, Filter } from "lucide-react";
import { ALERT_TYPES } from "../../../context/services/mock/government/dashboard";
import { HeatmapArea } from "../hooks/useDashboard";

type DashboardFiltersProps = {
  filters: {
    timeframe: string;
    region: string;
    alertType: string;
  };
  areas: HeatmapArea[];
  setFilters: React.Dispatch<React.SetStateAction<{
    timeframe: string;
    region: string;
    alertType: string;
  }>>;
};

/**
 * FilterItem: A composite component for individual filter selects.
 */
const FilterItem = ({ label, value, onChange, options, t }: any) => (
  <div className="flex flex-col gap-2 text-(--text-sm)">
    <label className="font-semibold text-(--color-text-secondary)">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-(--color-border) bg-(--color-surface) text-(--color-text-primary) pl-4 pr-10 py-3 focus:ring-2 focus:ring-(--color-primary-soft) focus:border-transparent outline-none transition-all"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none" />
    </div>
  </div>
);

export default function DashboardFilters({ filters, areas, setFilters }: DashboardFiltersProps) {
  const { t } = useTranslation();

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const timeframeOptions = [
    { value: "24h", label: t("dashboard.filter.24h") },
    { value: "7days", label: t("dashboard.filter.7days") },
    { value: "30days", label: t("dashboard.filter.30days") },
  ];

  const regionOptions = [
    { value: "all", label: `${t("dashboard.filter.allRegions")} (${areas.length})` },
    ...areas.map((area) => ({
      value: String(area.id),
      label: `${area.name} · ${area.region}`,
    })),
  ];

  const alertTypeOptions = [
    { value: "all", label: t("dashboard.filter.allTypes") },
    ...ALERT_TYPES.map((type) => ({
      value: type.value,
      label: t(type.labelKey),
    })),
  ];

  return (
    <section className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm">
      <div className="flex items-center gap-2 text-(--color-text-primary) mb-4">
        <Filter size={18} className="text-(--color-primary)" />
        <h2 className="m-0 text-(--text-lg) font-semibold">{t("dashboard.filter.title")}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FilterItem
          label={t("dashboard.filter.timeframe")}
          value={filters.timeframe}
          onChange={(val: string) => handleFilterChange("timeframe", val)}
          options={timeframeOptions}
          t={t}
        />
        <FilterItem
          label={t("dashboard.filter.region")}
          value={filters.region}
          onChange={(val: string) => handleFilterChange("region", val)}
          options={regionOptions}
          t={t}
        />
        <FilterItem
          label={t("dashboard.filter.alertType")}
          value={filters.alertType}
          onChange={(val: string) => handleFilterChange("alertType", val)}
          options={alertTypeOptions}
          t={t}
        />
      </div>
    </section>
  );
}
