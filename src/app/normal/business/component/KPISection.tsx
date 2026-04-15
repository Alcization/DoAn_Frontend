"use client";

import { useTranslation } from "react-i18next";
import { useKPIDataFactory } from "@/app/normal/hooks/useKPIDataFactory";

interface KPISectionProps {
  timeRange: string;
}

export default function KPISection({ timeRange }: KPISectionProps) {
  const { t } = useTranslation();
  const { kpiItems } = useKPIDataFactory(timeRange);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {kpiItems.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-[var(--color-surface)] rounded-[var(--radius-3xl)] p-4 shadow-[var(--shadow-md)] flex flex-col items-center justify-center hover:shadow-[var(--shadow-lg)] transition-shadow border border-[var(--color-border)]"
        >
          <div className={`w-12 h-12 rounded-[var(--radius-2xl)] ${kpi.colorClass} flex items-center justify-center mb-3`}>
            <kpi.icon size={24} />
          </div>
          <p className="text-[var(--text-xs)] sm:text-[var(--text-sm)] text-[var(--color-text-secondary)] m-0 text-center">
            {t(`businessReports.kpi.${kpi.label}`)}
          </p>
          <p className="text-[var(--text-lg)] sm:text-[var(--text-xl)] font-bold text-[var(--color-text-primary)] m-0 mt-1">
            {kpi.value}
          </p>
        </div>
      ))}
    </div>
  );
}

