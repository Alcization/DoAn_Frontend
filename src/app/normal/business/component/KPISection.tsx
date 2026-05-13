"use client";

import { useTranslation } from "react-i18next";
import { Loader, AlertCircle } from "lucide-react";
import { useKPIDataFactory } from "@/app/normal/hooks/useKPIDataFactory";
import { SavedRoute } from "./ReportFilters";

interface KPISectionProps {
  timeRange: string;
  route?: SavedRoute | null;
}

export default function KPISection({ timeRange, route }: KPISectionProps) {
  const { t } = useTranslation();
  const { kpiItems, isLoading, error } = useKPIDataFactory(timeRange, route);

  if (!route) {
    return (
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-3xl)] p-6 shadow-[var(--shadow-md)] border border-[var(--color-border)] text-center text-[var(--color-text-secondary)]">
        <p>{t("businessReports.kpi.selectRoute") || "Vui lòng chọn tuyến đường để xem dữ liệu thời tiết"}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-3xl)] p-6 shadow-[var(--shadow-md)] border border-[var(--color-border)] flex items-center justify-center gap-3">
        <Loader size={20} className="animate-spin text-[var(--color-primary)]" />
        <p className="text-[var(--color-text-secondary)]">Đang tải dữ liệu thời tiết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-3xl)] p-6 shadow-[var(--shadow-md)] border border-red-300">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-semibold">Lỗi tải dữ liệu thời tiết</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}

