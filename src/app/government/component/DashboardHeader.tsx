"use client";

import { BarChart3, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

type DashboardHeaderProps = {
  viewMode: "map" | "charts";
  setViewMode: (mode: "map" | "charts") => void;
  areaCount: number;
};

export default function DashboardHeader({
  viewMode,
  setViewMode,
  areaCount,
}: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase text-[var(--color-primary)] tracking-wide">
          {t("dashboard.role")}
        </p>
        <h1 className="m-0 text-3xl font-bold text-[var(--color-text-primary)]">
          {t("dashboard.title")}
        </h1>
        <p className="m-0 mt-2 text-sm text-[var(--color-text-secondary)]">
          {t("dashboard.subtitle", { count: areaCount })}
        </p>
      </div>
      <div className="flex bg-[var(--color-surface)] p-1 rounded-[var(--radius-md)] border border-[var(--color-border)]">
        <button
          className={`px-4 py-2 flex items-center gap-2 rounded-[calc(var(--radius-md)-4px)] text-sm font-medium transition-all ${
            viewMode === "map"
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
          }`}
          onClick={() => setViewMode("map")}
        >
          <MapPin size={16} /> {t("dashboard.view.map")}
        </button>
        <button
          className={`px-4 py-2 flex items-center gap-2 rounded-[calc(var(--radius-md)-4px)] text-sm font-medium transition-all ${
            viewMode === "charts"
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
          }`}
          onClick={() => setViewMode("charts")}
        >
          <BarChart3 size={16} /> {t("dashboard.view.charts")}
        </button>
      </div>
    </header>
  );
}
