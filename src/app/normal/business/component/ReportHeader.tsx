"use client";

import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReportHeaderProps {
  routeCount: number;
  exportChartAsImage: (id: string, name: string) => void;
}

export default function ReportHeader({ routeCount, exportChartAsImage }: ReportHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 className="text-[var(--text-2xl)] sm:text-[var(--text-3xl)] lg:text-[var(--text-4xl)] font-bold text-[var(--color-text-primary)] m-0">
          {t("businessReports.title")}
        </h1>
        <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] m-0 mt-1">
          {t("businessReports.subtitle", { count: routeCount })}
        </p>
      </div>
      <button
        onClick={() => exportChartAsImage("weather-chart", "report")}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[var(--radius-xl)] border-none bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity text-[var(--text-sm)] sm:text-[var(--text-base)] cursor-pointer shadow-[var(--shadow-sm)]"
      >
        <Download size={18} /> {t("businessReports.buttons.download") || "Download Report"}
      </button>
    </div>
  );
}

