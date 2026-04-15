"use client";

import { useTranslation } from "react-i18next";
import { AreaChart, Activity, Users } from "lucide-react";
import { MANAGED_AREAS } from "../../../context/services/mock/government/area-management";

export default function AreaStats() {
  const { t } = useTranslation();

  const totalAreas = MANAGED_AREAS.length;
  const activeAreas = MANAGED_AREAS.filter((a) => a.status === "active").length;
  const totalPopulation = MANAGED_AREAS.reduce((acc, curr) => acc + curr.population, 0);

  const stats = [
    {
      label: t("areaManagement.stats.totalAreas"),
      value: totalAreas,
      icon: AreaChart,
      color: "bg-[var(--color-primary-bg)] text-[var(--color-primary)]",
    },
    {
      label: t("areaManagement.stats.activeAreas"),
      value: activeAreas,
      icon: Activity,
      color: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
    },
    {
      label: t("areaManagement.stats.totalPopulation"),
      value: totalPopulation.toLocaleString(),
      icon: Users,
      color: "bg-[var(--color-info-bg)] text-[var(--color-info)]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-all"
        >
          <div className={`p-3 rounded-2xl ${stat.color}`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)]">
              {stat.label}
            </p>
            <p className="text-[var(--text-2xl)] font-bold text-[var(--color-text-primary)]">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
